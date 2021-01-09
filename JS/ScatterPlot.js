 /* In this file we create a Scatter Plot
     CURRENTLY: drawDashedZeroLines
     */




function populateSVGWithScatterPlot(svg_id, scatter_data, axes_info) {
    /* Args:
      svg_id: (str) DOM id of svg object
      scatter_data: (Object)
         min_y: Number
         max_y: Number
         min_x: Number 
         max_x: Number
         point_list: list<<fit (Num), t (Num)>, ... >
      axes_info: (Object) 
        Like svg_axes_info as defined in 
            makeSVGAxesAndLabels from d3SVGUtil.js
            but with some parts left undefined,
            like x axis left corner
    */
    
    let x_axis_start_val = Math.ceil(scatter_data["min_x"] - 1);
    let x_axis_end_val = Math.floor(scatter_data["max_x"] + 1);
    let y_axis_start_val = Math.floor(scatter_data["min_y"] - 1);
    let y_axis_end_val = Math.ceil(scatter_data["max_y"] + 1);

    // GetProperTicks is function from d3SVGUtil
    let x_ticks_list = GetProperTicks(x_axis_start_val, x_axis_end_val)
    let y_ticks_list = GetProperTicks(y_axis_start_val, y_axis_end_val)
    // ^ Note x_ticks_list and y_ticks_list are list<Num>

    // We add the values 0 to both the x_ticks_list and the y_ticks_list
    let x_info_a = addZeroToTicksList(x_ticks_list)
    let y_info_a = addZeroToTicksList(y_ticks_list)
    // We get ticks lists and whether or not they cross zero
    x_ticks_list = x_info_a[0]
    let x_crosses_zero = x_info_a[1]
    y_ticks_list = y_info_a[0]
    let y_crosses_zero = y_info_a[1]
    
    // Just the main axes and labels for the axes, no ticks
    ret_d = makeSVGAxesAndLabels(svg_id, axes_info)


    /*
     ret_d contains:
        x_axis_len: Num
        y_axis_len: Num
        graph_blc: (coordinates [x,y])
        graph_trc: (coordinates [x,y])
        y_axis_start: (coordinates [x,y])
        x_axis_start: (coordinates [x,y])
    */

    // We draw dashed lines where the 0's of each axis are
    d3svg = getSVG(svg_id);
    drawDashedZeroLines(d3svg, x_ticks_list, y_ticks_list,
                        ret_d['x_axis_len'], ret_d['x_axis_start'],
                        ret_d['y_axis_len'], ret_d['y_axis_start'],
                        x_crosses_zero, y_crosses_zero)


    // We draw the ticks and the labels for X, then Y:

    // First we need to generate the tick_info_list:
    
    x_tick_info_list = makeStandardTickInfoListFromTicks(x_ticks_list, 10)
    makeAxisTicksAndTickLabels(svg_id, "x",
                               ret_d['x_axis_start'], 
                               [ret_d['x_axis_start'][0] + ret_d['x_axis_len'],
                               ret_d['x_axis_start'][1]],
                               x_tick_info_list) 

    y_tick_info_list = makeStandardTickInfoListFromTicks(y_ticks_list, 10)
    makeAxisTicksAndTickLabels(svg_id, "y",
                               ret_d['y_axis_start'], 
                               [ret_d['y_axis_start'][0],
                               ret_d['y_axis_start'][1]  - ret_d['y_axis_len']],
                               y_tick_info_list) 


    // Now we actually populate the graph with points
    let point_list = scatter_data["point_list"];

    populateSVGWithScatterPoints(d3svg,
                                 point_list,
                                 x_ticks_list,
                                 y_ticks_list,
                                 ret_d['x_axis_start'],
                                 ret_d['y_axis_start'],
                                 ret_d['x_axis_len'],
                                 ret_d['y_axis_len'])
    /*
    let total_x_range = x_ticks_list[x_ticks_list.length -1] - x_ticks_list[0];
    let total_y_range = y_ticks_list[y_ticks_list.length -1] - y_ticks_list[0];

    for (let i = 0; i < point_list.length; i++) {

        let point = point_list[i];

        //Getting point coordinates
        let point_coordinates = [ret_d['x_axis_start'][0] + (
                             (point[0] - x_ticks_list[0])/total_x_range)*ret_d['x_axis_len'],
                             ret_d['y_axis_start'][1] - (
                             (point[1] - y_ticks_list[0])/total_y_range)*ret_d['y_axis_len']]

        if (point[0] < 0) {
        
                            
            // Drawing the circle red
            addPointToPlot(d3svg,
                        point_coordinates, 
                        "red",
                        "circle",
                        3,
                        0.5,
                        [],
                        nullfunc)
        } else {

            // Drawing the circle green
            addPointToPlot(d3svg,
                        point_coordinates, 
                        "green",
                        "circle",
                        3,
                        0.5,
                        [],
                        nullfunc)
        }
    }
    */
}

function populateSVGWithScatterPoints(d3svg,
                                      point_list,
                                      x_ticks,
                                      y_ticks,
                                      x_axis_start,
                                      y_axis_start,
                                      x_axis_len,
                                      y_axis_len) {
    /*
     *
     * point_list: list<[x (Num), y (Num)]> for all the points
     *      based on actual numerical data, not coordinates
     *  x_ticks: list<Num> ticks in x axis
     *  y_ticks: list<Num> ticks in y axis
     *  x_axis_start: coordinates [Num, Num]
     *  y_axis_start: coordinates [Num, Num]
     *  x_axis_len: Num
     *  y_axis_len: Num
     *
     */

    let total_x_range = x_ticks[x_ticks.length -1] - x_ticks[0];
    let total_y_range = y_ticks[y_ticks.length -1] - y_ticks[0];

    for (let i = 0; i < point_list.length; i++) {

        let point = point_list[i];

        //Getting point coordinates
        let point_coordinates = [x_axis_start[0] + (
                             (point[0] - x_ticks[0])/total_x_range)*x_axis_len,
                             y_axis_start[1] - (
                             (point[1] - y_ticks[0])/total_y_range)*y_axis_len]

        if (point[0] < 0) {
        
                            
            // Drawing the circle red
            addPointToPlot(d3svg,
                        point_coordinates, 
                        "red",
                        "circle",
                        3,
                        0.5,
                        [],
                        nullfunc)
        } else {

            // Drawing the circle green
            addPointToPlot(d3svg,
                        point_coordinates, 
                        "green",
                        "circle",
                        3,
                        0.5,
                        [],
                        nullfunc)
        }
    }
}




function nullfunc(x) {
    //null func
    
}


function drawDashedZeroLines(d3svg, x_ticks_list, y_ticks_list, 
                            x_axis_len, x_axis_start,
                            y_axis_len, y_axis_start,
                            draw_x_zero_dashed=true,
                            draw_y_zero_dashed=true) {
    /*
     * We find where 0's occur within the ticks list
     * and their ratio to the total length of the axes
     * and draw a dashed line.
     * To find where the 0's occur, we take the full
     * numerical distance between the tick's lowest value
     * and the ticks highest value and find range of 0 from
     * lowest value and create line perpendicularly from
     * that point.
     *  
     *
        x_axis_len: Num
        y_axis_len: Num
        y_axis_start: (coordinates [x,y])
        x_axis_start: (coordinates [x,y])
     * We take the function makeDashedLine(d3svg, start_coordinates, end_coordinates,
                        dash_length, break_length,
                        color, stroke_width)
     */


    if (draw_x_zero_dashed) {

        let total_y_range = y_ticks_list[y_ticks_list.length -1] - y_ticks_list[0];
        let x_zero_frac = ((-1)*y_ticks_list[0])/total_y_range;
        let x_zero_dashed_start = [y_axis_start[0], 
                                y_axis_start[1] - y_axis_len*x_zero_frac]
        let x_zero_dashed_end = [y_axis_start[0] + x_axis_len, 
                                y_axis_start[1] - y_axis_len*x_zero_frac]


        makeDashedLine(d3svg, x_zero_dashed_start, x_zero_dashed_end,
                        3,3,
                        "green", 1)
    }

    if (draw_y_zero_dashed) {
        
        let total_x_range = x_ticks_list[x_ticks_list.length -1] - x_ticks_list[0];
        let y_zero_frac = ((-1)*x_ticks_list[0])/total_x_range

        let y_zero_dashed_start = [x_axis_start[0] + x_axis_len*y_zero_frac, 
                                x_axis_start[1]]
        let y_zero_dashed_end = [x_axis_start[0] + x_axis_len*y_zero_frac, 
                                x_axis_start[1] - y_axis_len]

        makeDashedLine(d3svg, y_zero_dashed_start, y_zero_dashed_end,
                        3,3,
                        "blue", 1)
    }




}

function addZeroToTicksList(ticks_list) {
    /* ticks_list is list<Num> to which we add the number 0
        if it doesn't exist
        If the ticks_list doesn't cross zero
        we return crosses_zero_bool = False
        
        Returns:
            <new_tick_list, crosses_zero_bool>
    */

    let transitional_index = -1;
    let less_than_zero = true;
    let crosses_zero_bool = true;

    for (let i=0; i<ticks_list.length; i++) {
        let c_t = ticks_list[i];
        if (c_t >= 0) {
            if (c_t == 0) {
                return [ticks_list, crosses_zero_bool];
            } else {
                    transitional_index = i;
                    less_than_zero = false;
                    break;
            }
        }
    }
    
    if (less_than_zero == true) {
        console.log("ticks_list never crosses zero")
        crosses_zero_bool = false;
        return [ticks_list, crosses_zero_bool]
    } else {
        let new_ticks_list = ticks_list.slice(0,transitional_index).concat([0]) 
                                    .concat(ticks_list.slice(transitional_index));
        return [new_ticks_list, crosses_zero_bool]
    }
    
}
