extern crate proc_macro;
use proc_macro2::TokenStream;
use quote::quote;
use syn::{parse2, Data, DataStruct, DeriveInput, Fields, Type, TypePath};

static PRIMITIVES: [&str; 7] = ["u8", "u16", "u32", "i8", "i16", "i32", "Base32"];

/// Macro allows to derive the IntoCairoArgs trait. This trait allows
/// a Vec<CairoArgs> to be derived from the structure.
#[proc_macro_derive(CairoArgs)]
pub fn derive_into_cairo_args(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    // Build the trait implementation
    let input = proc_macro2::TokenStream::from(input);

    proc_macro::TokenStream::from(impl_into_cairo_args(input))
}

fn impl_into_cairo_args(input: TokenStream) -> TokenStream {
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = match parse2::<DeriveInput>(input) {
        Ok(tree) => tree,
        Err(e) => return e.to_compile_error(),
    };

    let name = &ast.ident;
    let fields = match &ast.data {
        Data::Struct(DataStruct {
            fields: Fields::Named(fields),
            ..
        }) => &fields.named,
        _ => panic!("expected named field"),
    };

    let fields_name = fields.iter().map(|f| &f.ident);
    let fields_typ = fields.iter().map(|f| &f.ty);

    let mut lines = vec![];
    for (f, t) in fields_name.zip(fields_typ) {
        match t {
            Type::Path(TypePath { path, .. }) => {
                let has_vec = path.segments.iter().any(|x| x.ident == "Vec");
                let has_primivite = path
                    .segments
                    .iter()
                    .any(|x| PRIMITIVES.contains(&&*x.ident.to_string()));
                if has_vec {
                    lines.push(quote!(
                        CairoArg::from(mayberelocatable!(input.#f.len())),
                        IntoCairoArgs::into(input.#f),
                    ));
                } else if has_primivite {
                    lines.push(quote!(CairoArg::from(mayberelocatable!(input.#f)),))
                }
            }
            _ => panic!("unsupported type"),
        }
    }

    let gen = quote! {
        impl From<#name> for Vec<CairoArg> {
            fn from(input: #name) -> Vec<CairoArg> {
                let args: Vec<CairoArg> = vec![
                    #(
                        #lines
                    )*
                ];
                args
            }
        }
    };
    gen
}

/// Macro allows to derive the From<Vec<i32>> trait for the structure
#[proc_macro_derive(CairoStruct)]
pub fn derive_into_cairo_struct(input: proc_macro::TokenStream) -> proc_macro::TokenStream {
    // Build the trait implementation
    let input = proc_macro2::TokenStream::from(input);

    proc_macro::TokenStream::from(impl_into_cairo_struct(input))
}

fn impl_into_cairo_struct(input: TokenStream) -> TokenStream {
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = match parse2::<DeriveInput>(input) {
        Ok(tree) => tree,
        Err(e) => return e.to_compile_error(),
    };

    let name = &ast.ident;
    let fields = match &ast.data {
        Data::Struct(DataStruct {
            fields: Fields::Named(fields),
            ..
        }) => &fields.named,
        _ => panic!("expected named field"),
    };

    let fields_name = fields.iter().map(|f| &f.ident);
    let fields_typ = fields.iter().map(|f| &f.ty);

    let mut lines = vec![];
    for (f, t) in fields_name.zip(fields_typ) {
        match t {
            Type::Path(TypePath { path, .. }) => {
                let has_vec = path.segments.iter().any(|x| x.ident == "Vec");
                let has_primivite = path
                    .segments
                    .iter()
                    .any(|x| PRIMITIVES.contains(&&*x.ident.to_string()));
                if has_vec {
                    lines.push(quote!(
                        (start, end) = update_indexes(end, &value[..], inputs.#f[0].size());
                        inputs.#f = extract_inputs(&value[start..end], inputs.#f[0].size());
                    ));
                } else if has_primivite {
                    lines.push(quote!(
                        inputs.#f = value[end] as #t;
                        end += 1;
                    ));
                }
            }
            _ => panic!("unsupported type"),
        }
    }

    let gen = quote! {
        impl From<Vec<Base32>> for #name {
            fn from(value: Vec<Base32>) -> #name {
                let mut inputs: #name = #name::default();
                let mut start = 0_usize;
                let mut end = 0_usize;
                #(
                    #lines
                )*
                inputs
            }
        }

        fn extract_inputs<T: FromSliceBase32>(arr: &[Base32], chunk_size: usize) -> Vec<T> {
            arr.chunks(chunk_size)
                .into_iter()
                .map(|x| FromSliceBase32::from(x))
                .collect()
        }

        fn update_indexes(end: usize, arr: &[Base32], chunk_size: usize) -> (usize, usize) {
            (end + 1, end + 1 + arr[end] as usize * chunk_size)
        }
    };
    gen
}

#[cfg(test)]
mod tests {
    use crate::{impl_into_cairo_args, impl_into_cairo_struct};
    use quote::quote;

    #[test]
    fn test_cairo_args_basic() {
        let expected = quote!(
            impl From<Basic> for Vec<CairoArg> {
                fn from(input: Basic) -> Vec<CairoArg> {
                    let args: Vec<CairoArg> = vec![
                        CairoArg::from(mayberelocatable!(input.combos_offset_0.len())),
                        IntoCairoArgs::into(input.combos_offset_0),
                    ];
                    args
                }
            }
        );

        let actual = impl_into_cairo_args(quote!(
            struct Basic {
                combos_offset_0: Vec<i32>,
            }
        ));
        assert_eq!(expected.to_string(), actual.to_string());
    }

    #[test]
    fn test_cairo_args_complex() {
        let expected = quote!(
            impl From<Complex> for Vec<CairoArg> {
                fn from(input: Complex) -> Vec<CairoArg> {
                    let args: Vec<CairoArg> = vec![
                        CairoArg::from(mayberelocatable!(input.combos_offset_0.len())),
                        IntoCairoArgs::into(input.combos_offset_0),
                        CairoArg::from(mayberelocatable!(input.combos_0.len())),
                        IntoCairoArgs::into(input.combos_0),
                        CairoArg::from(mayberelocatable!(input.combos_offset_1.len())),
                        IntoCairoArgs::into(input.combos_offset_1),
                        CairoArg::from(mayberelocatable!(input.combos_1.len())),
                        IntoCairoArgs::into(input.combos_1),
                        CairoArg::from(mayberelocatable!(input.state_machine_offset_0.len())),
                        IntoCairoArgs::into(input.state_machine_offset_0),
                        CairoArg::from(mayberelocatable!(input.state_machine_0.len())),
                        IntoCairoArgs::into(input.state_machine_0),
                        CairoArg::from(mayberelocatable!(input.initial_state_0)),
                        CairoArg::from(mayberelocatable!(input.state_machine_offset_1.len())),
                        IntoCairoArgs::into(input.state_machine_offset_1),
                        CairoArg::from(mayberelocatable!(input.state_machine_1.len())),
                        IntoCairoArgs::into(input.state_machine_1),
                        CairoArg::from(mayberelocatable!(input.initial_state_1)),
                        CairoArg::from(mayberelocatable!(input.functions_offset_0.len())),
                        IntoCairoArgs::into(input.functions_offset_0),
                        CairoArg::from(mayberelocatable!(input.functions_0.len())),
                        IntoCairoArgs::into(input.functions_0),
                        CairoArg::from(mayberelocatable!(input.functions_offset_1.len())),
                        IntoCairoArgs::into(input.functions_offset_1),
                        CairoArg::from(mayberelocatable!(input.functions_1.len())),
                        IntoCairoArgs::into(input.functions_1),
                        CairoArg::from(mayberelocatable!(input.actions_0.len())),
                        IntoCairoArgs::into(input.actions_0),
                        CairoArg::from(mayberelocatable!(input.actions_1.len())),
                        IntoCairoArgs::into(input.actions_1),
                        CairoArg::from(mayberelocatable!(input.char_0)),
                        CairoArg::from(mayberelocatable!(input.char_1)),
                    ];
                    args
                }
            }
        );
        let actual = impl_into_cairo_args(quote!(
            struct Complex {
                combos_offset_0: Vec<i32>,
                combos_0: Vec<i32>,
                combos_offset_1: Vec<i32>,
                combos_1: Vec<i32>,
                state_machine_offset_0: Vec<i32>,
                state_machine_0: Vec<Tree>,
                initial_state_0: u8,
                state_machine_offset_1: Vec<i32>,
                state_machine_1: Vec<Tree>,
                initial_state_1: u8,
                functions_offset_0: Vec<i32>,
                functions_0: Vec<Tree>,
                functions_offset_1: Vec<i32>,
                functions_1: Vec<Tree>,
                actions_0: Vec<i32>,
                actions_1: Vec<i32>,
                char_0: u8,
                char_1: u8,
            }
        ));
        assert_eq!(expected.to_string(), actual.to_string());
    }

    #[test]
    fn test_cairo_struct_basic() {
        let expected = quote!(
            impl From<Vec<Base32>> for Basic {
                fn from(value: Vec<Base32>) -> Basic {
                    let mut inputs: Basic = Basic::default();
                    let mut start = 0_usize;
                    let mut end = 0_usize;
                    (start, end) = update_indexes(end, &value[..], inputs.combos_offset_0[0].size());
                    inputs.combos_offset_0 = extract_inputs(&value[start..end], inputs.combos_offset_0[0].size());
                    inputs
                }
            }

            fn extract_inputs<T: FromSliceBase32>(arr: &[Base32], chunk_size: usize) -> Vec<T> {
                arr.chunks(chunk_size)
                    .into_iter()
                    .map(|x| FromSliceBase32::from(x))
                    .collect()
            }

            fn update_indexes(end: usize, arr: &[Base32], chunk_size: usize) -> (usize, usize) {
                (end + 1, end + 1 + arr[end] as usize * chunk_size)
            }
        );

        let actual = impl_into_cairo_struct(quote!(
            struct Basic {
                combos_offset_0: Vec<Base32>,
            }
        ));
        assert_eq!(expected.to_string(), actual.to_string());
    }

    #[test]
    fn test_cairo_struct_complex() {
        let expected = quote!(
            impl From<Vec<Base32>> for Complex {
                fn from(value: Vec<Base32>) -> Complex {
                    let mut inputs: Complex = Complex::default();
                    let mut start = 0_usize;
                    let mut end = 0_usize;
                    (start, end) = update_indexes(end, &value[..], inputs.combos_offset_0[0].size());
                    inputs.combos_offset_0 = extract_inputs(&value[start..end], inputs.combos_offset_0[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.combos_0[0].size());
                    inputs.combos_0 = extract_inputs(&value[start..end], inputs.combos_0[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.combos_offset_1[0].size());
                    inputs.combos_offset_1 = extract_inputs(&value[start..end], inputs.combos_offset_1[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.combos_1[0].size());
                    inputs.combos_1 = extract_inputs(&value[start..end], inputs.combos_1[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.state_machine_offset_0[0].size());
                    inputs.state_machine_offset_0 = extract_inputs(&value[start..end], inputs.state_machine_offset_0[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.state_machine_0[0].size());
                    inputs.state_machine_0 = extract_inputs(&value[start..end], inputs.state_machine_0[0].size());
                    inputs.initial_state_0 = value[end] as u8;
                    end += 1;
                    (start, end) = update_indexes(end, &value[..], inputs.state_machine_offset_1[0].size());
                    inputs.state_machine_offset_1 = extract_inputs(&value[start..end], inputs.state_machine_offset_1[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.state_machine_1[0].size());
                    inputs.state_machine_1 = extract_inputs(&value[start..end], inputs.state_machine_1[0].size());
                    inputs.initial_state_1 = value[end] as u8;
                    end += 1;
                    (start, end) = update_indexes(end, &value[..], inputs.functions_offset_0[0].size());
                    inputs.functions_offset_0 = extract_inputs(&value[start..end], inputs.functions_offset_0[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.functions_0[0].size());
                    inputs.functions_0 = extract_inputs(&value[start..end], inputs.functions_0[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.functions_offset_1[0].size());
                    inputs.functions_offset_1 = extract_inputs(&value[start..end], inputs.functions_offset_1[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.functions_1[0].size());
                    inputs.functions_1 = extract_inputs(&value[start..end], inputs.functions_1[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.actions_0[0].size());
                    inputs.actions_0 = extract_inputs(&value[start..end], inputs.actions_0[0].size());
                    (start, end) = update_indexes(end, &value[..], inputs.actions_1[0].size());
                    inputs.actions_1 = extract_inputs(&value[start..end], inputs.actions_1[0].size());
                    inputs.char_0 = value[end] as u8;
                    end += 1;
                    inputs.char_1 = value[end] as u8;
                    end += 1;
                    inputs
                }
            }

            fn extract_inputs<T: FromSliceBase32>(arr: &[Base32], chunk_size: usize) -> Vec<T> {
                arr.chunks(chunk_size)
                    .into_iter()
                    .map(|x| FromSliceBase32::from(x))
                    .collect()
            }

            fn update_indexes(end: usize, arr: &[Base32], chunk_size: usize) -> (usize, usize) {
                (end + 1, end + 1 + arr[end] as usize * chunk_size)
            }
        );
        let actual = impl_into_cairo_struct(quote!(
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
        ));
        assert_eq!(expected.to_string(), actual.to_string());
    }
}
