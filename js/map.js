function draw_map(map_data, selector){
  //Width and height
  var w = 700;
  var h = 500;

  //Define map projection
  var projection = d3.geoMercator();

  //Define path generator
  var path = d3.geoPath().projection(projection);

  //Create SVG element
  var svg = d3.select(selector)
              .append("svg")
              .attr("viewBox", "0 0 " + (w) + " " + (h))
              .attr("width", w)
              .attr("height", h)
              .style('background-color', '#ccc');

  // Rewind data
  var rewind_data = map_data.features.map(function(f) {
		return turf.rewind(f,{reverse:true});
	})

	// Fit projection size
	projection.fitSize(
	[w, h],
	{"type": "FeatureCollection", "features": rewind_data});

  //Bind data and create one path per GeoJSON feature
  var color_map = {
    'Eastern': '#31a354',
    'Western': '#756bb1',
    'Central': '#636363',
    'Northern': '#e6550d',
  }
  svg.append("g")
     .attr("class", "region")
     .selectAll("path")
     .data(rewind_data)
     .enter()
     .append("path")
     .attr("d", path)
     .attr('title', function(d){ return d['properties']['name']})
     .attr('data-toggle', 'tooltip')
     .style("fill", function(d){ return color_map[d['properties']['name']]})
     .style('stroke', '#000000')
     .style('stroke-width', '1');
};


function scatter_plot(chart_data, selector){
  //Width and height
  var margin = {
      'top': 10,
      'right': 30,
      'bottom': 30,
      'left': 60,
  };

  var width = 700 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select(selector)
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

  var x_min = d3.min(chart_data, function (d) { return d.long; });
  var x_max = d3.max(chart_data, function (d) { return d.long; });

  var y_min = d3.min(chart_data, function (d) { return d.lat; });
  var y_max = d3.max(chart_data, function (d) { return d.lat; });

  // Add X axis
  var x = d3.scaleLinear()
            .domain([x_min, x_max])
            .range([0, width]);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
            .domain([y_min, y_max])
            .range([height, 0]);

  svg.append("g")
     .call(d3.axisLeft(y));

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(chart_data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.long); } )
      .attr("cy", function (d) { return y(d.lat); } )
      .attr("r", 3)
      .attr('title', function(d){ return d.region;})
      .attr('data-toggle', 'tooltip')
      .style("fill", function (d) { return d.color;});
};
