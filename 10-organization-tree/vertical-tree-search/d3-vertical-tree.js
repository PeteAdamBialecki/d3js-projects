// Checkout this link to figure out how to possibly add a search to this thing:
// https://stackoverflow.com/questions/13715127/search-for-an-element-in-d3-force-layout-or-tree

//===============================================
function select2DataCollectName(d) {
    if (d.children){
        d.children.forEach(select2DataCollectName);    	
    } else if (d._children) {
        d._children.forEach(select2DataCollectName);    	
    }
    select2Data.push(d.data.name);
}
//===============================================
function searchTree(d) {
    if (d.children)
        d.children.forEach(searchTree);
    else if (d._children)
        d._children.forEach(searchTree);
    var searchFieldValue = eval(searchField);
    if (searchFieldValue && searchFieldValue.match(searchText)) {
        // Walk parent chain
        var ancestors = [];
        var parent = d;
        while (typeof(parent) !== "undefined") {
            ancestors.push(parent);
	console.log(parent);
            parent.class = "found";
            parent = parent.parent;
        }
    console.log(ancestors);
    }
}
//===============================================
function clearAll(d) {
	d.class = "";
    if (d.children) {
        d.children.forEach(clearAll);
    }
    else if (d._children) {
        d._children.forEach(clearAll);
    }
}

//===============================================
function collapseAllNotFound(d) {
    if (d.children) {
    	if (d.class !== "found") {
        	d._children = d.children;
        	d._children.forEach(collapseAllNotFound);
        	d.children = null;
	} else 
        	d.children.forEach(collapseAllNotFound);
    }
}
//===============================================
function expandAll(d) {
    if (d._children) {
        d.children = d._children;
        d.children.forEach(expandAll);	
        d._children = null;
    } else if (d.children)
        d.children.forEach(expandAll);	
}
//===============================================
// Toggle children on click.
function toggle(d) {
	console.log(d);
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  clearAll(root);
  update(d);
  $("#searchName").select2("val", "");
}
//===============================================
$("#searchName").on("select2:select", function(e) {
    clearAll(root);
    expandAll(root);
    update(root);
    searchField = "d.name";
    searchText = $('#searchName :selected').text();
    searchTree(root);
    root.children.forEach(collapseAllNotFound);
    update(root);
});
//===============================================

var margin = { top: 20, right: 0, bottom: 60, left: 10 },
	width = 300,
	barHeight = 20,
	barWidth = (width - margin.left - margin.right) * 0.13;

var i = 0,
	duration = 500,
	root;
	
/* var tree = d3.layout.tree()
			.size([height, width]); */

var diagonal = d3.linkHorizontal()
	.x(function (d) { return d.y; })
	.y(function (d) { return d.x; });

var svg = d3.select("#indentedVerticalOrgTree")
	.attr("width", width) // + margin.left + margin.right)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	function moveChildren(d) {
	    if(d.children) {
	        d.children.forEach(function(c) { moveChildren(c); });
	        d._children = d.children;
	        d.children = null; 
	    }
	}
	
// d3.json("http://localhost:8080/fi-admin/admin/organization/list", function (error, flare) {
d3.json("https://gist.githubusercontent.com/mbostock/1093025/raw/b40b9fc5b53b40836ead8aa4b4a17d948b491126/flare.json", function (error, flare) {
	if (error) throw error;
	root = d3.hierarchy(flare);
	root.x0 = 0;
	root.y0 = 0;
	  select2Data = [];
	  select2DataCollectName(root);
	  select2DataObject = [];
	  select2Data.sort(function(a, b) {
	            if (a > b) return 1; // sort
	            if (a < b) return -1;
	            return 0;
	        })
	        .filter(function(item, i, ar) {
	            return ar.indexOf(item) === i;
	        }) // remove duplicate items
	        .filter(function(item, i, ar) {
	            select2DataObject.push({
	                "id": i,
	                "text": item
	            });
	        });
	  
	$('#searchNode').select2({
	    data: select2DataObject,
	    placeholder: "Search for a name..."
	});
	
	function collapse(d) {
	  if (d.children) {
	    d._children = d.children;
	    d._children.forEach(collapse);
	    d.children = null;
	  }
	}
	root.children.forEach(collapse);
	update(root);
});


function update(source) {
	$('#d3OrgTreeContainer').css("height", height - 40);
	
	// Compute the flattened node list.
	var nodes = root.descendants();
	var height = Math.max(100, nodes.length * barHeight + margin.top + margin.bottom);
	var links = root.links(nodes);
	
	$('#d3OrgTreeContainer').css("height", height - 60).css('width', width + 20);

	d3.select("svg").transition()
	    .duration(duration)
	    .attr("height", height);
	
	d3.select(self.frameElement).transition()
	    .duration(duration)
	    .style("height", height + "px");
	
	// Compute the "layout". TODO https://github.com/d3/d3-hierarchy/issues/67
	var index = -1;
	root.eachBefore(function (n) {
	    n.x = ++index * barHeight;
	    n.y = n.depth * 30;
	});
	
	// Update the node
	var node = svg.selectAll(".node")
	    .data(nodes, function (d) { return d.id || (d.id = ++i); });
	
	var nodeEnter = node.enter().append("g")
	    .attr("class", "node")
	    .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	    .style("opacity", 1e-6);
	
	// Enter any new nodes at the parent's previous position.
	nodeEnter.append("rect")
	    .attr("y", -barHeight / 2)
	    .attr("height", barHeight)
	    .attr("width", barWidth * 4)
	    .style("fill", color)
	    .on("click", click)
		.on('mouseover', function(d, i) {
			d3.select(this)
		        .transition()
		        .duration(100)
		        .style('fill', '#aaa');
	    })
	    .on('mouseout', function(d, i) {
	    	d3.select(this)
		        .transition()
		        .duration(100)
		        .style("fill", color);
	    });

	nodeEnter.append("text")
	.attr("dy", 3.5)
	.attr("dx", 5.5)
	.text(function (d) { return d.data.name; })
	.text(function(d) { 
        	if (d.children) {
          		return '- ' + d.data.name;
        } else if (d._children) {
          	return '+ ' + d.data.name;
        } else {
          	return d.data.name;
        }
  	});
      
	node.select('text')
		.text(function(d) { 
        	if (d.children) {
          		return '- ' + d.data.name;
        } else if (d._children) {
          	return '+ ' + d.data.name;
        } else {
          	return d.data.name;
        }
      });
	
	  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
  	  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) {
            if (d.class === "found") {
                return "#ff4136"; //red
            } else if (d._children) {
                return "lightsteelblue";
            } else {
                return "#fff";
            }
        })
        .style("stroke", function(d) {
            if (d.class === "found") {
                return "#ff4136"; //red
            }
        });
	
	// Transition nodes to their new position.
	nodeEnter.transition()
	    .duration(duration)
	    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
	    .style("opacity", 1);
	
	node.transition()
	    .duration(duration)
	    .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; })
	    .style("opacity", 1)
	    .select("rect")
	    .style("fill", color);
	
	// Transition exiting nodes to the parent's new position.
	node.exit().transition()
	    .duration(duration)
	    .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
	    .style("opacity", 1e-6)
	    .remove();
	
	// Update the links
	var link = svg.selectAll("path.link")
	    .data(root.links(), function (d) { return d.target.id; });
	
	// Enter any new links at the parent's previous position.
	link.enter().insert("path", "g")
	    .attr("class", "link")
	    .attr("d", function (d) {
	        var o = { x: source.x0, y: source.y0 };
	        return diagonal({ source: o, target: o });
	    })
	    .transition()
	    .duration(duration)
	    .attr("d", diagonal);
	
	// Transition links to their new position.
	link.transition()
	    .duration(duration)
	    .attr("d", diagonal)
	          .style("stroke", function(d) {
            if (d.target.class === "found") {
                return "#ff4136";
            }
        });
	
	// Transition exiting nodes to the parent's new position.
	link.exit().transition()
	    .duration(duration)
	    .attr("d", function (d) {
	        var o = { x: source.x, y: source.y };
	        return diagonal({ source: o, target: o });
	    })
	    .remove();
	
	// Stash the old positions for transition.
	root.each(function (d) {
		    d.x0 = d.x;
		    d.y0 = d.y;
		});

}


// Toggle children on click.
var lastClickD = null;
function click(d) {
	if (d.children) {
	    d._children = d.children;
	    d.children = null;
	    $('.indented-tree-container').css('transition', 'all 1.5s ease');
	} else {
	    d.children = d._children;
	    d._children = null;
	    $('.indented-tree-container').css('transition', 'all 0.3s ease');
	} if (lastClickD){
    	lastClickD._isSelected = false;
  	}
	d._isSelected = true;
	lastClickD = d;
	update(d);
}

function color(d) {
	if (d._isSelected) return "#d9534f";
	return d._children ? "#5cb85c" : d.children ? "#5897fb" : "#eee";
}

$('.btn-group').on('click', '.btn', function() {
	  $(this).addClass('active').siblings().removeClass('active');
});

$('#searchNode').trigger('change');