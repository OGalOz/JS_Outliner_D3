# Javascript Outliner with d3 SVG

## What's the point?
* The point of this program is to simplify creating visualizations
    in browsers, and to use d3-js more easily in that process.
* This only helps to create an outline shell in a box-like format
* Additional option of designing the axes and title for a graph

    

## How?
* In order to create a viz-shell in a webpage, (i.e. A set of boxes
    that contain different information but are all in one
    large box) we use a specific data file, which is essentially
    a Javascript object that has a form described below. We
    name this type of object "Viz_Shell_Data". It doesn't control
    the d3 visualization, but it does control
    the general creation of a shell. When you create a "Viz_Shell_Data"
    object, you need to start by naming a parent id within the DOM
    that already exists. This could be the 'body' tag, or it could
    be an already created tag besides the body. Regardless, you must
    have the first subwindow point to that as its "parent_id" in the
    "id_i" property. Every subsequent subwindow must point to an existing
    parent, preferrably one of the first subwindows.
* To run the creation of a shell from a Shell_Data object, we need
    the LayoutUtil.js file.


* Note: Throughout this text, dobj means DOM objects

### Viz_Shell_Data:
 * Data files (JS objects) have the following form:
1. A "window_shell" is a JS object which has
    a property "lyt_vls".
    * "lyt_vls" contains multiple properties called subwindows, each of which contains the following: 
    1. "tag_type"
    2. "id_i"
    3. "size_loc_i"
    4. "style_i"
    5. "unq_prp"
    * Note: subwindows may also contain any other properties not listed above.

#### Explanation of subwindow's properties:
1. "tag_type":
    * this is the HTML tag type of the subwindow.
2. "id_i": Contains id info for dobj
    * this object contains a few properties:
        1. "parent_id": The id of the parent DOM object
        2. "id": The id 
        3. (optional) ["class": the class of this object]
3. "size_loc_i": Contains size and location info.
    * We are deciding on the "left", "top", etc. values
    1. "values_type": "fractions" | "fixed" (one of those two)
        this property indicates if the 
        following properties within this section
        are fractional or fixed. So for example,
        you could want the object to always be 
        30 pixels away from the left border of the
        parent. In that case,
        make the value "fixed". Otherwise, you may
        always want the left value to be 15% of the
        size of the parent window; in that case,
        choose "fractions" and the value 0.15. 
        The values type applies
        to all following properties within this 
        section ("l", "t", "w", "h")
    2. "l", "t", "h", "w": Respectively refer to
        "left", "top", "height", "width"
4. "style_i": Contains style info.
    * Here you must make a mapping between style property
        and it's value, in the Javascript language. e.g.
        ```Javascript 
        "border": "2px solid gray"
        ```
5. "unq_prp": Contains tag attributes, 
    * match attribute to value in the object. e.g. 
    ```Javascript
    "innerHTML": "Hello World" 
    ```



### LayoutUtil.js file explained:
    * Functions:
    1. createEntireShellFromShellDataObject(shell_data_obj)
            This function can be used to check if your shell
            data object was written correctly. Run this and
            your objects should populate the entire parent
            id. Your top parent id can be body or it can
            refer to an existing dobj. Each parent id
            must exist before the object is created. Remember
            the shell_data_obj has to have the property "lyt_vls".
    2. lUaddBasicLayout(DOM_object, basic_layout_d)
            computes and sends correct left, top, height, width 
            to lUAddLayoutSizeLocToDOMObj
    3. lUAddLayoutSizeLocToDOMObj(DOM_obj, lft, tp, ht, wd)
        Takes left, top, height, and width number values
            and turns it into string for DOM and adds to dobj.
    4. lUAddStyleToDOMObj(DOM_obj, style_d)
        For every style property in style_d, it adds it's value
            to the dobj.
    5. lUAddPropertiesToDOMObj(DOM_obj, property_d)
        This technically adds attributes to the dobj
    6. lUAddElementToParent(DOM_obj, parent_id)
        This adds an element to its parent
    7. lUCreateElementFromInfo(inp_obj)
        This takes an object with all the essential
            sub objects listed above ( "tag_type",
            "id_i", "size_loc_i", "style_i", "unq_prp")
            and generates a dobj with all the relevant info.
    8. checkFracValues(basic_layout_d)
        If we use "fractions" instead of "fixed", we check
            that the fractions are properly indicated.
    9. prepInt(inp_i)
        inp_i is an int or float with no decimal nonzero digits, 
        value will be converted into
        string and have commas: 1000000 -> '1,000,000'
    10. fracToPrcString(flt)
        flt is a fraction to be turned into percent and cut short to 3 decimals
    11. create_d3_SVG_in_parent(parent_id, id, width, height, border=null, position=null)
        All params are str.  Note that we always want the SVG height and width to
        be 100% of the enclosing box in order to control its location

### SVG Util file
    1. getSVG(svg_id)
        returns d3 SVG object (may be unnecessary since it's easy to write)
    2. clearSVG(svg_id)
        clears the svg entirely
    3. makeSVGAxesAndLabels(svg_id, svg_axes_info)
        Creates the axes and the labels given
            the information in svg_axes_info
    4. makeYAxisLabel(d3svg, svgWidth, svgHeight, yt)
        This (subfunction of makeSVGAxesAndLabels) 
            creates the Y axis and rotates it 270 degrees.
    5. makeLine(d3svg, color, x1, y1, x2, y2, stroke_width)
        This creates a line
    6. makeText(d3svg, font_weight, font_size, x, y, text_str)

