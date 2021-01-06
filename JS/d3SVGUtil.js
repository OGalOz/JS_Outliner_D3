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
        svg_d3 = getSVG(svg_id)
        svg_d3.selectAll("*").remove();
}

function makeSVGAxesAndLabels(svg_id, svg_axes_info) {
    // This function takes the standard form of 
    // SVG graph axes inputs as defined in this package
    // and creates the axis and the labels.
   

    // Args:
    //  svg_id: (str) DOM id of svg
    //  svg_axes_info: Object
    //     graph_i
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

    d3svg = getSVG(svg_id)
    svg_dobj = document.getElementById(svg_id)
    dWidth = svg_dobj.clientWidth
    dHeight = svg_dobj.clientHeight


    x_i = svg_axes_info["x_i"]
    y_i = svg_axes_info["y_i"]

   // We create the axis lengths 
   x_axis_len = x_i["x_axis_i"]["len_frac"]*dWidth;
   y_axis_len = y_i["y_axis_i"]["len_frac"]*dHeight;



    // We get the location of the bottom left corner of where the 
    // x and y values start
   x_org = svg_axes_info["graph_i"]["blc"][0]*dWidth;
   y_org = svg_axes_info["graph_i"]["blc"][1]*dHeight;

    console.log("x_org")
    console.log(x_org)
    console.log("y_org")
    console.log(y_org)
   
   //Making X axis line (no ticks)
   makeLine(d3svg, "black", x_org, y_org, x_org + x_axis_len, y_org, 
        x_i["x_axis_i"]["style_i"]["strokeWidth"]);

   //Making Y axis line (no ticks)
   makeLine(d3svg, "black", x_org, y_org, x_org, y_org - y_axis_len, 
        y_i["y_axis_i"]["style_i"]["strokeWidth"]);

    
   // Labels
    xt = x_i["x_title_i"]
    yt = y_i["y_title_i"]

   // X-Axis Text Label
   makeText(d3svg, xt["style_i"]["fontWeight"], xt["style_i"]["fontSize"], x_org + x_axis_len*xt["blc"][0],
           dHeight*xt["blc"][1], xt["label"])
   
   makeYAxisLabel(d3svg, dWidth, dHeight, yt);

}



function makeYAxisLabel(d3svg, svgWidth, svgHeight, yt) {
    // yt: 
    //              blc: <x frac from left, y frac from top>
    //              trc: <x frac from left, y frac from top>
    //              style_i:
    //                  name (Str) -> value (str)
    //              label: str

            Yx = svgWidth * (yt["blc"][0] + yt["trc"][0]) * (0.5)
            Yy = svgHeight * (yt["blc"][1] + yt["trc"][1]) * (0.5)

            ax_tsl = Yx.toString() + "," + Yy.toString()

            d3svg.append('text')
                .attr('font-weight', yt["style_i"]["fontWeight"])
                .attr("transform", "translate(" + ax_tsl + ") rotate(270)")
                .attr('font-size', yt["style_i"]["fontSize"])
                .text(yt["label"]);

}




function makeLine(svg_obj, color, x1, y1, x2, y2, stroke_width ) {
    /*
     * Args: 
     *  svg_obj: A d3 svg object
     *  color: str, like "black"
     *  x1 - y2, Numbers
     *  stroke_width: width of line, Number
     *
     * Note: We need to make sure the numbers are relatively close to integers
     */

               return svg_obj.append('line')
                   .attr('x1', x1.toFixed(2))
                   .attr('y1', y1.toFixed(2))
                   .attr('x2', x2.toFixed(2))
                   .attr('y2', y2.toFixed(2))
                   .attr('stroke', color)
                   .attr('stroke-width', stroke_width)
                   .attr('position', 'absolute')
                   ;

}


function makeText(svg_obj, font_weight, font_size, x, y, text_str) {
    /*
     *  Args:
     *  
     *      svg_obj: A d3 svg object
     *      font_weight: (str) like "bold", "normal",
     *      font_size, x, y: Number
     *      text_str: (str) Text you want to make
     *
     */
            svg_obj.append('text')
                .attr('font-weight', font_weight)
                .attr('font-size', font_size)
                .attr('x', x)
                .attr('y', y)
                .text(text_str);

}
