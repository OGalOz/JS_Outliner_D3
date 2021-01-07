// The point of this util file
// is to centralize common functions on
// graphs such as building axes, etc.
// it relies on the d3 package
// all 'frac' means value between 0 and 1


function getSVG(svg_id) {
        //svg_id is str
     
        let svg_d3 = d3.select("#" + svg_id);
        return svg_d3

}

function clearSVG(svg_id) {
        //svg_id is str

        let svg_d3 = getSVG(svg_id)
        svg_d3.selectAll("*").remove();

}

function makeSVGAxesAndLabels(svg_id, svg_axes_info) {
    // This function takes the standard form of 
    // SVG graph axes inputs as defined in this package
    // and creates the axis and the labels.
   

    // Args:
    //  svg_id: (str) DOM id of svg
    //  svg_axes_info: Object
    //     graph_i (Where points are plotted)
    //          blc <x frac from left, y frac from top>
    //          trc <x frac from left, y frac from top>
    //     x_i: 
    //          x_title_i:
    //              blc: <x frac from left, y frac from top>
    //              trc: <x frac from left, y frac from top>
    //              style_i:
    //                  name (Str) -> value (str)
    //              label: str
    //          x_axis_i:
    //              lc: <x frac from left, y frac from top>
    //              len_frac: Number (frac length of axis)
    //              style_i (as above in x_title_i)
    //      y_i: Same as x_i with property "bc" instead of "lc"


    let d3svg = getSVG(svg_id)
    // we get a document object model version of the svg for dimensions
    let svg_dobj = document.getElementById(svg_id)
    let dWidth = svg_dobj.clientWidth
    let dHeight = svg_dobj.clientHeight


    let x_i = svg_axes_info["x_i"]
    let y_i = svg_axes_info["y_i"]

   // We create the axis lengths 
   let x_axis_len = x_i["x_axis_i"]["len_frac"]*dWidth;
   let y_axis_len = y_i["y_axis_i"]["len_frac"]*dHeight;




    // We get the location of the bottom left corner of where the 
    // x and y values start
    let x_axis_org = [x_i["x_axis_i"]["lc"][0] * dWidth, 
                      x_i["x_axis_i"]["lc"][1] * dHeight]

    let y_axis_org = [y_i["y_axis_i"]["bc"][0] * dWidth, 
                      y_i["y_axis_i"]["bc"][1] * dHeight]

   let x_blc = svg_axes_info["graph_i"]["blc"][0]*dWidth;
   let y_blc = svg_axes_info["graph_i"]["blc"][1]*dHeight;

   //Making X axis line (no ticks)
   makeLine(d3svg, "black", x_axis_org[0], x_axis_org[1], 
            x_axis_org[0] + x_axis_len, x_axis_org[1], 
            x_i["x_axis_i"]["style_i"]["strokeWidth"]);

   //Making Y axis line (no ticks)
   makeLine(d3svg, "black", y_axis_org[0], y_axis_org[1], 
            y_axis_org[0], y_axis_org[1] - y_axis_len, 
            y_i["y_axis_i"]["style_i"]["strokeWidth"]);

    
   // Labels
    let xt = x_i["x_title_i"]
    let yt = y_i["y_title_i"]

   // X-Axis Text Label
   makeText(d3svg, xt["style_i"]["fontWeight"], xt["style_i"]["fontSize"],
            x_axis_org[0] + x_axis_len*xt["blc"][0],
           dHeight*xt["blc"][1], xt["label"], xt["style_i"]["fontColor"])
   
   makeYAxisLabel(d3svg, dWidth, dHeight, yt);

    return {
        "x_axis_start": x_axis_org,
        "y_axis_start": y_axis_org,
        "x_axis_len": x_axis_len,
        "y_axis_len": y_axis_len
    }

}



function makeYAxisLabel(d3svg, svgWidth, svgHeight, yt) {
    // yt: 
    //              blc: <x frac from left, y frac from top>
    //              trc: <x frac from left, y frac from top>
    //              style_i:
    //                  name (Str) -> value (str)
    //              label: str

            // Yx and Yy refer to the Y label location x and y coordinates
            let Yx = svgWidth * (yt["blc"][0] + yt["trc"][0]) * (0.5)
            let Yy = svgHeight * (yt["blc"][1] + yt["trc"][1]) * (0.5)

            let ax_tsl = Yx.toString() + "," + Yy.toString()

            
            let font_weight = yt["style_i"]["fontWeight"]
            if (font_weight == null) {
                font_weight = "bold"
            }

            let font_color = yt["style_i"]["fontColor"]
            if (font_color == null) {
                font_color = "black"
            }
            

            d3svg.append('text')
                .attr('font-weight', font_weight )
                .attr("transform", "translate(" + ax_tsl + ") rotate(270)")
                .attr('font-size', yt["style_i"]["fontSize"])
                .attr('fill', font_color)
                .text(yt["label"]);

}

function makeAxisTicksAndTickLabels(svg_id, axis_type,
                                    axis_start_loc, axis_end_loc,
                                    tick_info_list) {

    // This function takes the starting and ending points of 
    // an axis and adds ticks with information coming
    // from the 'tick_info_list'
    //
    // Args:
    //      svg_id: (str) The id of the svg object we want to add to
    //      axis_start_loc: list< x_val (Number), y_val (Number)>
    //      axis_end_loc: list< x_val (Number), y_val (Number)>
    //      axis_type: (str) fixed vocab ["x" (horizontal), or "y" (vertical)]
    //      tick_info_list: list<tick_info>
    //          tick_info: list<frac (Number), tick_length (Number), tick_style,
    //                          tick_color, tick_stroke_width,
    //                          label_style, label_text, label_color
    //                          label_font_size, label_dist>
    //              frac: The TOTAL fraction of the axis where this tick lies
    //              tick_length: The length of the tick within the SVG
    //              tick_style: str fixed vocab: ["top", "cross", "bottom"]
    //                  this refers to if the tick points up from the axis,
    //                  crosses the axis, or protrudes from the bottom of
    //                  the axis.
    //              tick_color: str (CSS color)
    //              label_style: str fixed vocab ["above", "below"]
    //              label_text: str The actual label value.
   
    let d3svg = getSVG(svg_id)
    let axis_length = null
    if (axis_type == "x") {
        axis_length = axis_end_loc[0] - axis_start_loc[0]
    } else if (axis_type == "y") {
        axis_length = axis_end_loc[1] - axis_start_loc[1]
    } else {
        throw "unknown axis type: " + axis_type
    }

    // Here we add the ticks
    for (let i=0; i < tick_info_list.length; i++) {

        let crnt_tick_info = tick_info_list[i];

        // This variable holds the [x,y] location of tick center
        let tick_axis_loc = null
        if (axis_type == "x") {
           tick_axis_loc = [axis_start_loc[0] + crnt_tick_info[0]*axis_length,
                            axis_start_loc[1]]
        } else if (axis_type == "y") {
           tick_axis_loc = [axis_start_loc[0],
                            axis_start_loc[1] - crnt_tick_info[0]*axis_length ]
        }
        addTickAndLabel(d3svg, axis_type, crnt_tick_info, tick_axis_loc)
    }
}

function addTickAndLabel(d3svg, axis_type, tick_info, tick_axis_loc) {
    // Info regarding params comes from function 
    //  makeAxisTicksAndTickLabels
    //  tick_axis_loc: list<x (Num), y (Num)>
    //  tick_info: list<frac (Number), tick_length (Number), tick_style,
    //                  tick_color, tick_stroke_width,
    //                  label_style, label_text, label_color,
    //                  label_font_size, label_dist>

    let tick_start_loc = null
    let tick_end_loc = null

    if (axis_type == "x") {
        if (tick_info[2] == "top") {
            tick_start_loc = tick_axis_loc
            tick_end_loc = [tick_axis_loc[0], tick_axis_loc[1] - tick_info[1]]
        } else if (tick_info[2] == "cross") {
            tick_start_loc = [tick_axis_loc[0], tick_axis_loc[1] + tick_info[1]/2]
            tick_end_loc = [tick_axis_loc[0], tick_axis_loc[1] - tick_info[1]/2]
        } else if (tick_info[2] == "bottom") {
            tick_start_loc = tick_axis_loc
            tick_end_loc = [tick_axis_loc[0], tick_axis_loc[1] + tick_info[1]]
        }

        makeLine(d3svg, tick_info[3], tick_start_loc[0],
                tick_start_loc[1], tick_end_loc[0], 
                tick_end_loc[1], tick_info[4])

        // Label - checking label style ("top" or "bottom")
        let init_label_loc = null;
        if (tick_info[5] == "top") {
            init_label_loc = [tick_axis_loc[0], tick_axis_loc[1] - tick_info[9]]
        } else if (tick_info[5] == "bottom") {
            init_label_loc = [tick_axis_loc[0], tick_axis_loc[1] + tick_info[9]]
        }

        makeText(d3svg, "normal", tick_info[8], init_label_loc[0] - 3,
                 init_label_loc[1], tick_info[6], tick_info[7])

    } else if (axis_type == "y") {

        if (tick_info[2] == "top") {
            tick_start_loc = tick_axis_loc
            tick_end_loc = [tick_axis_loc[0] + tick_info[1], tick_axis_loc[1]]
        } else if (tick_info[2] == "cross") {
            tick_start_loc = [tick_axis_loc[0] - tick_info[1]/2, tick_axis_loc[1]]
            tick_end_loc = [tick_axis_loc[0] + tick_info[1]/2, tick_axis_loc[1]]
        } else if (tick_info[2] == "bottom") {
            tick_start_loc = tick_axis_loc
            tick_end_loc = [tick_axis_loc[0] - tick_info[1], tick_axis_loc[1]]
        }
        
        makeLine(d3svg, tick_info[3], tick_start_loc[0],
                tick_start_loc[1], tick_end_loc[0], 
                tick_end_loc[1], tick_info[4])

        // Label - checking label style ("top" or "bottom")
        let init_label_loc = null;
        if (tick_info[5] == "top") {
            init_label_loc = [tick_axis_loc[0] + tick_info[9], tick_axis_loc[1]]
        } else if (tick_info[5] == "bottom") {
            init_label_loc = [tick_axis_loc[0] -  tick_info[9], tick_axis_loc[1]]
        }

        makeText(d3svg, "normal", tick_info[8], init_label_loc[0],
                 init_label_loc[1] + 3, tick_info[6], tick_info[7])

    }

}



function makeLine(d3svg, color, x1, y1, x2, y2, stroke_width ) {
    /*
     * Args: 
     *  d3svg: A d3 svg object
     *  color: str, like "black"
     *  x1 - y2, Numbers
     *  stroke_width: width of line, Number
     *
     * Note: We need to make sure the numbers are relatively close to integers
     */

               return d3svg.append('line')
                   .attr('x1', x1.toFixed(2))
                   .attr('y1', y1.toFixed(2))
                   .attr('x2', x2.toFixed(2))
                   .attr('y2', y2.toFixed(2))
                   .attr('stroke', color)
                   .attr('stroke-width', stroke_width)
                   .attr('position', 'absolute')
                   ;

}


function makeText(d3svg, font_weight, font_size, x, y, text_str, font_color) {
    /*
     *  Args:
     *  
     *      d3svg: A d3 svg object
     *      font_weight: (str) like "bold", "normal",
     *      font_size, x, y: Number
     *      text_str: (str) Text you want to make
     *
     */
    if (font_color == null) {
        font_color = "black"
    }
    if (text_str == null) {
        text_str = "Default Text"
    }

    d3svg.append('text')
        .attr('font-weight', font_weight)
        .attr('font-size', font_size)
        .attr('fill', font_color)
        .attr('x', x)
        .attr('y', y)
        .text(text_str);

}


function GetProperTicks(start_val, end_val) {
    /*
    This function is to get properly spread ticks between
    two INTEGER values where end_val > start_val
    Min ticks in axis is ~ 8, Max is ~ 16

    Note: dif must be an integer value

    start_val: Number
    end_val Number

    Returns:
        ticks_list = [start_val, start_val + subdivs, start_val + 2subdivs,..., end_val]
    */

    // Checking inputs
    if ( (Math.floor(start_val) != start_val) || 
        (Math.floor(end_Val) != end_val) ) {
            throw "start_val and end_val must be integers"
    }

    let tick_values = null;
    let subdivs = null;
    let dif = end_val - start_val
    if (dif >= 16) {
        subdivs = ConvertValueIntoSubDivs(dif);
    } else {
        if (dif >= 8) {
            subdivs = 1
        } else if (dif >= 4) {
            subdivs = .5;
        } else if (dif >= 2) {
            subdivs = .25;
        } else if (dif == 1) {
            subdivs = .1
        } else {
            throw "end_val must be greater than start_val in GetProperTicks"
        }

    }

    tick_values = GetTickValues(start_val, end_val, subdivs);

    return tick_values;
}

function ConvertValueIntoSubDivs(Val) {
    /*
     *
     * Args: 
     *      Val is a positive integer
    Important Questions:
    1. Max ticks in axis assuming no more than 3 digits per value?
        Answer: 16
    2. Min ticks in axis?
        Answer: 8

    Meaning: 
        if N = d * 10^n, d > 5 implies division is 5 * 10^(n-2)
        4 < d < 5 implies division is  2.5 * 10^(n-2)
        2 < d < 4 implies division is  2 * 10^(n-2)
        1 < d < 2 implies division is 1 * 10^(n-2)
    */

    let val_info = BaseNotation(Val, 10, 20);
    let dig = val_info[0];
    let power = val_info[1];
    let subdivs = null;

    if (power === 0) {
        subdivs = 1 ;
    } else {
            if (dig >=8) { 
            subdivs =  Math.pow(10,power);
            } else if (dig >= 6) { 
            subdivs = 5 * Math.pow(10, power-1);
            } else {
            subdivs = Math.floor(dig) * Math.pow(10, power-1);
            }
    }
    return subdivs;
}

function BaseNotation(N, base, max_power) {

    /* We get power of base and digit multiplier.
        Eg. if N = 346, base = 10 we return [3.46, 2] because
            3.46 * 10^2 = 346 


    Args:
        N: int, number to find bounds for. MUST BE > 0
        base: int 
        max_power: int (limit so function doesn't run forever with while loop)

    Returns:
        [a, b (power of 10)] where a*10^b = N
        OR [-1, -1] if it failed for some reason

    */

    if (N <= 0) {
        return [-1, -1]
    }
    for (i=0; i < max_power + 1 ;i++){
        if (N >= Math.pow(base,i) && N < Math.pow(base,i+1)) {
            return [ N/Math.pow(base,i), i]
        }
    }

    return [-1, -1]

}


function GetTickValues(start_val, end_val, subdivs) {

    /* Simple function that adds subdivs from start val 
     * until it reaches end_val
     * We go from a value and subdivs to actual graph ticks


    Args:
        start_val: (int)
        end_val: (int)
        subdivs: (int)

    Returns:
        ticks_list = [start_val, start_val + subdivs, start_val + 2subdivs,...]

    Specifically, this function starts from start_val and adds subdiv until reaching
        end_val. Note that difference between start_val and end_val does not 
        need t
    */
    // First we get a list of just each tick, not the start and end ticks (no dbl)
    let init_tick_list = [start_val];

    let crnt_val = start_val + subdivs;

    while (crnt_val < end_val){
        init_tick_list.push(crnt_val);
        crnt_val = crnt_val + subdivs;
    }

    init_tick_list.push(end_val);


    return init_tick_list;

}


