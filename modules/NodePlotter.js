export default { addCircllerPlot, addBarPlot }

function addCircllerPlot(order, columnName, color, node, innerRadius, outerRadius, sum, csv_data,  padding, height) {
    // 0から1の間にスケールする
    var columnData = csv_data.map(function (d) { return d[columnName]; });
    var deleteHyphenColumnData = columnData.filter(function (d) { return d !== "-"; })
    var min = d3.min(deleteHyphenColumnData);
    var max = d3.max(deleteHyphenColumnData);
    var scaleData = d3.scaleLinear()
        .domain([min, max])
        .range([0, 1]);
    //円弧を追加
    node.append("path")
        .attr("class", "limit-scale")//ズームした時サイズをキープ
        .filter(function (d) { return !d.children; })
        .attr("fill", function (d) {
            var foundData = csv_data.find(element => element.indicator === d.data.name);
            var alpha = scaleData(foundData[columnName]);
            if (!alpha) {
                alpha = 0;
            }
            return "rgb(" + color + "," + alpha + ")";
        })
        .attr("d", d3.arc() // imagine your doing a part of a donut plot
            .innerRadius(innerRadius + (outerRadius - innerRadius) * order / sum)
            .outerRadius(innerRadius + (outerRadius - innerRadius) * (order + 1) / sum)
            .startAngle(0)              // .startAngle(order / sum * 2 * Math.PI)
            .endAngle(2 * Math.PI))             // .endAngle((order + 1) / sum * 2 * Math.PI)
    //外枠用　
    node.append("path")
        .attr("class", "limit-scale")//ズームした時サイズをキープ
        .filter(function (d) { return !d.children; })
        .attr("fill", "rgba(241, 243, 244,0.5)")
        .attr("d", d3.arc() // imagine your doing a part of a donut plot
            .innerRadius(innerRadius + (outerRadius - innerRadius) * (order+1) / sum)
            .outerRadius(innerRadius + (outerRadius - innerRadius) * (order + 1) / sum+1)
            .startAngle(0)              // .startAngle(order / sum * 2 * Math.PI)
            .endAngle(2 * Math.PI))             // .endAngle((order + 1) / sum * 2 * Math.PI)

}


function addBarPlot(order, columnName, color, node, innerRadius, outerRadius, sum, csv_data) {
    // innerRadiusとouterRadiusの範囲に収める関数
    var columnData = csv_data.map(function (d) { return d[columnName]; });
    var deleteHyphenColumnData = columnData.filter(function (d) { return d !== "-"; })
    var min = d3.min(deleteHyphenColumnData);
    var max = d3.max(deleteHyphenColumnData);
    var scaleData = d3.scaleLinear()
        .domain([min, max])
        .range([innerRadius, outerRadius]);

    // circler barplotを追加する

    node.append("path")
        .attr("class", "limit-scale")//ズームした時サイズをキープ
        .filter(function (d) { return !d.children; })
        .attr("fill", color)
        .attr("d", d3.arc() // imagine your doing a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius(function (d) {
                var foundData = csv_data.find(element => element.indicator === d.data.name);
                return scaleData(foundData[columnName]);
            })
            .startAngle(order / sum * Math.PI - Math.PI / 2)              // .startAngle(order / sum * 2 * Math.PI)
            .endAngle((order + 1) / sum * Math.PI - Math.PI / 2)              // .endAngle((order + 1) / sum * 2 * Math.PI)
            .padAngle(0.01)
            .padRadius(innerRadius))


}