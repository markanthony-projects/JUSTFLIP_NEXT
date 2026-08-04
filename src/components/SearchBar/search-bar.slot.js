/**
 * Geometry for the search bar, shared by the header and the home hero so both
 * render at an identical size and horizontal position.
 *
 * Centring is viewport-relative (`left-1/2` + `-translate-x-1/2`) and the mobile
 * width is derived from `100vw` rather than the parent. The header sits inside a
 * padded, max-width container while the hero spans the viewport — a percentage
 * width would resolve differently in each and the bars would not line up.
 *
 * Each usage adds its own vertical anchor.
 */
export const SEARCH_BAR_SLOT =
    "absolute left-1/2 -translate-x-1/2 w-[calc(100vw-1rem)] sm:w-[400px] md:w-[480px] xl:w-[600px]";
