extern crate proc_macro;
use anyhow::Error;
use proc_macro2::TokenStream;
use quote::{quote, ToTokens};
use syn::{
    parse2, Data, DataStruct, DeriveInput, Fields, PathArguments, PathSegment, Type, TypePath,
};

static PRIMITIVES: [&str; 7] = ["u8", "u16", "u32", "i8", "i16", "i32", "Base32"];

#[derive(thiserror::Error, Debug)]
enum CairoDeriveError {
    #[error("Error parsing the input: {0}")]
    ParseError(String),
}

/// Macro allows to derive the implementation of Into<CairoArg> for Vec<i32> trait
/// from a structure. The macro uses the structure to derive the implementation.
#[proc_macro_derive(CairoArgs)]
pub fn derive_into_cairo_args(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    // Build the trait implementation
    let input = proc_macro2::TokenStream::from(input);

    match impl_into_cairo_args(input) {
        Ok(output) => proc_macro::TokenStream::from(output),
        Err(e) => panic!("{}", e.to_string()),
    }
}

fn impl_into_cairo_args(input: TokenStream) -> Result<TokenStream, Error> {
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = parse2::<DeriveInput>(input)?;

    let name = &ast.ident;
    let fields = match &ast.data {
        Data::Struct(DataStruct {
            fields: Fields::Named(fields),
            ..
        }) => Ok(&fields.named),
        _ => Err(CairoDeriveError::ParseError(
            "expected named field".to_string(),
        )),
    }?;

    let fields_typ = fields.iter().map(|f| &f.ty);

    let mut lines = vec![];
    for t in fields_typ {
        match t {
            Type::Path(TypePath { .. }) => {
                let last_segment = get_last_segment(t)?;

                let is_vec = last_segment.ident == "Vec";
                let is_primivite = PRIMITIVES.contains(&last_segment.ident.to_string().as_str());

                if is_vec {
                    let inner_type: Type = get_inner_type(t)?;
                    lines.push(quote!(
                        let length = inputs[end];
                        (start, end) = get_new_indexes(end, &inputs[..], #inner_type::size());
                        cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                        cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    ));
                } else if is_primivite {
                    lines.push(quote!(
                        cairo_args.push(CairoArg::from(mayberelocatable!(inputs[end])));
                        end += 1;
                    ))
                }
            }
            _ => {
                return Err(CairoDeriveError::ParseError(format!(
                    "unsupported type {}",
                    t.to_token_stream()
                ))
                .into())
            }
        }
    }

    let name = quote::format_ident!("{}Vec", name);

    let gen = quote! {
        pub struct #name(pub Vec<i32>);

        impl Into<Vec<CairoArg>> for #name {
            fn into(self) -> Vec<CairoArg> {
                let mut start = 0_usize;
                let mut end = 0_usize;
                let inputs = self.0;
                let mut cairo_args: Vec<CairoArg> = vec![];

                #(
                    #lines
                )*
                cairo_args
            }
        }

        fn into_cairo_arg(arr: &[i32]) -> CairoArg {
            let arr: Vec<MaybeRelocatable> = arr.into_iter().map(|i| mayberelocatable!(*i)).collect();
            CairoArg::from(arr.to_vec())
        }

        fn get_new_indexes(end: usize, arr: &[i32], structure_size: usize) -> (usize, usize) {
            let start = end + 1;
            let arr_len = arr[end] as usize;
            let end = end + 1 + arr_len * structure_size;
            (start, end)
        }
    };

    Ok(gen)
}

fn get_inner_type(ty: &Type) -> Result<Type, Error> {
    let last_segment = get_last_segment(ty)?;
    let PathSegment { arguments, .. } = last_segment;
    if let PathArguments::AngleBracketed(angle_bracketed_args) = arguments {
        if let Some(syn::GenericArgument::Type(inner_type)) = angle_bracketed_args.args.first() {
            return Ok(inner_type.to_owned());
        }
    }

    Err(anyhow::anyhow!("unsupported type {}", ty.to_token_stream()))
}

fn get_last_segment(ty: &Type) -> Result<PathSegment, Error> {
    let last_segment = match ty {
        Type::Path(type_path) => type_path.path.segments.last().ok_or_else(|| {
            anyhow::anyhow!("unsupported type {}, no last segment", ty.to_token_stream())
        })?,
        _ => return Err(anyhow::anyhow!("unsupported type {}", ty.to_token_stream())),
    };

    Ok(last_segment.to_owned())
}

#[cfg(test)]
mod tests {
    use crate::impl_into_cairo_args;
    use quote::ToTokens;
    use syn::parse_quote;

    use super::*;
    #[test]
    fn test_get_inner_type() {
        // Given
        let ty: Type = parse_quote!(Vec<Tree>);

        // When
        let tree = get_inner_type(&ty).unwrap();

        // Then
        let expected: Type = parse_quote!(Tree);
        assert_eq!(
            expected.to_token_stream().to_string(),
            tree.to_token_stream().to_string(),
            "types should be equal"
        );
    }

    #[test]
    fn test_cairo_struct_basic() {
        // Given
        let basic_structure = quote!(
            struct Basic {
                combos_offset_0: Vec<Base32>,
            }
        );

        // When
        let actual = impl_into_cairo_args(basic_structure);

        // Then
        let expected = quote!(
            pub struct BasicVec(pub Vec<i32>);

            impl Into<Vec<CairoArg>> for BasicVec {
                fn into(self) -> Vec<CairoArg> {
                    let mut start = 0_usize;
                    let mut end = 0_usize;
                    let inputs = self.0;
                    let mut cairo_args: Vec<CairoArg> = vec![];

                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    cairo_args
                }
            }

            fn into_cairo_arg(arr: &[i32]) -> CairoArg {
                let arr: Vec<MaybeRelocatable> = arr.into_iter().map(|i| mayberelocatable!(*i)).collect();
                CairoArg::from(arr.to_vec())
            }

            fn get_new_indexes(end: usize, arr: &[i32], structure_size: usize) -> (usize, usize) {
                let start = end + 1;
                let arr_len = arr[end] as usize;
                let end = end + 1 + arr_len * structure_size;
                (start, end)
            }
        );

        assert_eq!(expected.to_string(), actual.unwrap().to_string());
    }

    #[test]
    fn test_cairo_struct_complex() {
        // Given
        let complex_structure = quote!(
            struct Complex {
                combos_offset_0: Vec<Base32>,
                combos_0: Vec<Base32>,
                combos_offset_1: Vec<Base32>,
                combos_1: Vec<Base32>,
                state_machine_offset_0: Vec<Base32>,
                state_machine_0: Vec<Tree>,
                initial_state_0: u8,
                state_machine_offset_1: Vec<Base32>,
                state_machine_1: Vec<Tree>,
                initial_state_1: u8,
                functions_offset_0: Vec<Base32>,
                functions_0: Vec<Tree>,
                functions_offset_1: Vec<Base32>,
                functions_1: Vec<Tree>,
                actions_0: Vec<Base32>,
                actions_1: Vec<Base32>,
                char_0: u8,
                char_1: u8,
            }
        );

        // When
        let actual = impl_into_cairo_args(complex_structure);

        // Then
        let expected = quote!(
            pub struct ComplexVec(pub Vec<i32>);

            impl Into<Vec<CairoArg>> for ComplexVec {
                fn into(self) -> Vec<CairoArg> {
                    let mut start = 0_usize;
                    let mut end = 0_usize;
                    let inputs = self.0;
                    let mut cairo_args: Vec<CairoArg> = vec![];

                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Tree::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    cairo_args.push(CairoArg::from(mayberelocatable!(inputs[end])));
                    end += 1;
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Tree::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    cairo_args.push(CairoArg::from(mayberelocatable!(inputs[end])));
                    end += 1;
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Tree::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Tree::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    let length = inputs[end];
                    (start, end) = get_new_indexes(end, &inputs[..], Base32::size());
                    cairo_args.push(CairoArg::from(mayberelocatable!(length)));
                    cairo_args.push(into_cairo_arg(&inputs[start..end]));
                    cairo_args.push(CairoArg::from(mayberelocatable!(inputs[end])));
                    end += 1;
                    cairo_args.push(CairoArg::from(mayberelocatable!(inputs[end])));
                    end += 1;

                    cairo_args
                }
            }

            fn into_cairo_arg(arr: &[i32]) -> CairoArg {
                let arr: Vec<MaybeRelocatable> = arr.into_iter().map(|i| mayberelocatable!(*i)).collect();
                CairoArg::from(arr.to_vec())
            }

            fn get_new_indexes(end: usize, arr: &[i32], structure_size: usize) -> (usize, usize) {
                let start = end + 1;
                let arr_len = arr[end] as usize;
                let end = end + 1 + arr_len * structure_size;
                (start, end)
            }
        );

        assert_eq!(expected.to_string(), actual.unwrap().to_string());
    }
}
