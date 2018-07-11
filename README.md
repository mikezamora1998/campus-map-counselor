# Counselor Map for Admissions

The following was developed using:
- Bootstrap
- jQuery
- Leaftet

* See it in action here
[https://www.csupueblo.edu/admissions/find-your-counselor.html](https://www.csupueblo.edu/admissions/find-your-counselor.html)

* Use this link to preview
https://mikezamora1998.github.io/campus-map-counselor/


## Usage/Updating

The **index.html** will be filled in using the javascript **custom.js**. 
```html
<!-- div for map placement on page -->
    <div id="mainMap" class="center-block col-xs-12 col-sm-12 col-md-12 col-lg-12"></div>
```
*This is the ```<div>``` that will be populated with the map.*

The **custom.js** will be where most if the changes are made for updates.
```javascript
var popup = L.popup()
                    .setLatLng(latlng)
                    .setContent('<span><strong>' + 
                                 layer.feature.properties.name + '</strong><br/>' + 
                                 layer.feature.properties.counselor + '</span>')  
                    .openOn(map);
```
*This code snippet populates the the text in the information popup*

The ```layer.feature.properties.name``` and ```layer.feature.properties.counselor``` specifically the **name** and **counselor** refer to the following values in **us-states.js**
```javascript 
"type": "Feature",
        "id": "CO6",
        "properties": {
            "name": "Logan",
            "counselor": "Michael Hellman",
            "url": "michael-hellman/index.html",
            "section": 5
```
Each county/state will have these values. These values are used to display the 
- **name** - of the county/state
- **counselor** - that operates the county/state
- **url** - the url the county/state will link to
- **section** - the section will determine the color in the **custom.js** method```function getColor(sec) {}```
