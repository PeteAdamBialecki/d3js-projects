1. Review popular online sources:
    - Census.gov > Geography > Maps and Data > Tiger Products > Cartographic Boundary Shapefiles
    - NaturalEarthData.com
2. Download Shape Files
3. Install Node modules, create Makefile with copied shape file download link, run "make Makefile".
4. http://bit.ly/usa-fips for FIPS codes (go to http://bit.ly/flicker-geo-api for State clipped areas and http://bit.ly/usa-fips for filtered areas).
    ogr2ogr
        -f GeoJSON // Output format
        counties-filtered.json // Output file
        build/us-counties.shp // Input file
        -where "STATEFP='06'" // Filtering

5. Converting GeoJSON to topojson
    geo2topo -o <output file> <input file>
        geo2topo -o topo-counties.json counties.json

6. Adding a D3 Projection
    geo2topo -o topo-counties-projected.json --projection='width = 960, height - 600, d3.geo.albersUsa() .scale(1280) .translate([width / 2, height / 2])' counties.json

7. Simplifying Data
    
NOTES:
- There is something wrong in the process of generating a JSON file with geo2topo.  What is the difference between "topojson" and "geo2topo"?  I am using the same files but getting a different result from the Pluralsight directions.  My JSON data only reveals a very small portion of the United States without any errors.  Reference "topo-counties-simplified.html" and "topo-counties-simplified.json".

- There still seems to be some kind of issue.  Try to understand why it works with all of the 'gz' files in the build folder and make file but not with the 'cb' files.  Then rerun 'make' in terminal in the 'geospatial-map' directory."
