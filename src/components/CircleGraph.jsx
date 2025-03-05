import * as d3 from "d3";
import { useEffect, useRef } from "react";

const CircleGraph = ({ data }) => {
  const svgRef = useRef();
  
  useEffect(() => {
    if (!data) return;

    const width = 600;
    const height = 600;

    const color = d3.scaleLinear()
      .domain([0, 5])
      .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
      .interpolate(d3.interpolateHcl);

    const pack = d3.pack()
      .size([width, height])
      .padding(3);

      const root = pack(d3.hierarchy(data).sum(() => 1));


    const svg = d3.select(svgRef.current)
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr("style", `max-width: 100%; height: auto; display: block; background: white; cursor: pointer;`);

    svg.selectAll("*").remove(); // Clean up before rendering

    const g = svg.append("g");

    const node = g.selectAll("circle")
      .data(root.descendants())
      .join("circle")
      .attr("fill", d => d.children ? color(d.depth) : "white")  // TODO CHANGE TO A PHOTO?
      .attr("pointer-events", d => !d.children ? "none" : null)
      .attr("stroke", "#050")
      .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
      .on("mouseout", function() { d3.select(this).attr("stroke", null); })
      .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));

      const label = g.append("g")
      .style("font", "10px sans-serif")
      .style("font-weight", "bold")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", d => d.parent === root ? 1 : 0)
      .style("display", d => d.parent === root ? "inline" : "none")
      .text(d => d.data.name);
    

    let focus = root;
    let view;
    zoomTo([focus.x, focus.y, focus.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];

      view = v;

      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }

    function zoom(event, d) {
      focus = d;

      const transition = svg.transition()
        .duration(750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return t => zoomTo(i(t));
        });

      label
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
        .style("fill-opacity", d => d.parent === focus ? 1 : 0)
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    svg.on("click", (event) => zoom(event, root));

  }, [data]);

  return <svg ref={svgRef}></svg>;
};

export default CircleGraph;
