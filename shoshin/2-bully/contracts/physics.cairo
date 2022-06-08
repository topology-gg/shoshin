%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le
from contracts.constants import (
    Vec2, Rectangle
)

func _test_rectangle_overlap {range_check_ptr} (
        rect_0 : Rectangle,
        rect_1 : Rectangle
    ) -> (bool : felt):
    alloc_locals

    let (bool_x_overlap) = _test_segment_overlap (
        rect_0.origin.x,
        rect_0.origin.x + rect_0.dimension.x,
        rect_1.origin.x,
        rect_1.origin.x + rect_1.dimension.x
    )

    let (bool_y_overlap) = _test_segment_overlap (
        rect_0.origin.y,
        rect_0.origin.y + rect_0.dimension.y,
        rect_1.origin.y,
        rect_1.origin.y + rect_1.dimension.y
    )

    return (bool_x_overlap * bool_y_overlap)
end

func _test_segment_overlap {range_check_ptr} (
        x0_left : felt,
        x0_right : felt,
        x1_left : felt,
        x1_right : felt
    ) -> (bool : felt):

    #
    # Algorithm:
    # find the segment whose left point is the smaller than the left point of the other segment;
    # call it segment-left (SL), and the other one segment-right (SR);
    # to overlap, the left point of SR should <= the right point of SL.
    #

    let (x0_is_sl) = is_le (x0_left, x1_left)

    if x0_is_sl == 1:
        ## x0 is SL
        let (bool) = is_le (x1_left, x0_right)
        return (bool)
    else:
        ## x1 is SL
        let (bool) = is_le (x0_left, x1_right)
        return (bool)
    end
end
