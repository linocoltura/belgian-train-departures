
var xmlData;

$(document).ready(function(){

  var station = getParameterByName('station');

  if(station != null){
    update();
    window.setInterval(function(){ myLoop() }, 5000);
  } else {
    $('body').html(' <section><label for="station_input">Train station: </label> <input id="station_input" placeholder="Antwerpen-Centraal" type="text"> <a href="#" id="station_submit">Submit</a></section>');
    
    
    document.getElementById("station_input").addEventListener('keyup',function(event){
      if (event.keyCode === 13) {
        var the_station = $('#station_input').val();
        window.location = window.location+'?station='+the_station;
      }
    });
  
    $('#station_submit').click(function(e){
      var the_station = $('#station_input').val();
      e.preventDefault();
      window.location = window.location+'?station='+the_station;
    });
  
  }
 
  

})


function update(){
  
  $.get("https://api.irail.be/liveboard/?station="+ getParameterByName('station') +"&lang=nl", function(data){
    xmlData = data;
    console.log(xmlData);
    $('.dataTable').html(' <tr><th>Departure</th><th>To</th><th>Type</th><th>Platform</th></tr> ');
    fill();

  });
}

function cleanUpSpecialChars(str)
{
    str = str.replace(/[ÀÁÂÃÄÅ]/g,"A");
    str = str.replace(/[àáâãäå]/g,"a");
    str = str.replace(/[ÈÉÊË]/g,"E");
    str = str.replace(/[éèêë]/g,"e");
    //.... all the rest
    return str
}

var all = document.getElementsByTagName("td");

var i = 1;                     //  set your counter to 1

function myLoop() {           //  create a loop function
  setTimeout(function () {    //  call a 3s setTimeout when the loop is called
      
      var random = Math.random();

      if(random > .8){
        $('td').eq(i-1).addClass('flicker');
      } else $('td').eq(i-1).removeClass('flicker');

      i++;                     //  increment the counter
      if (i < all.length) {            //  if the counter < 10, call the loop function
        myLoop();             //  ..  again which will trigger another 
      }     else i = 1;                    //  ..  setTimeout()
  }, 10)
}

window.setInterval(function(){ update() }, 30000);

function fill(){
  // data is a xml document now, so we query it...
  $(xmlData)
  // and search for all <field> elements
  .find('departure')
  // now we can play with each <field>
  .each(function(index, element){
    // as example we query & store the field
    var field = $(element)
    // get the values we want
    var time = field.find('time').text()
    var station = field.find('station').text()
    var platform = field.find('platform').text()
    var delay = parseInt(field.attr('delay'))/60;
    var canceled = parseInt(field.attr('canceled'));
    if(parseInt(delay)>0){
      delay = '+'+delay;
    } else delay = "";
    if(isNaN(field.find('vehicle').text().charAt(9))){
      var second = field.find('vehicle').text().charAt(9);
    } else second = "";
    var type = field.find('vehicle').text().charAt(8) + second;
    if(canceled == 1){
      $('.dataTable')
      .append('<tr> <td class="smallData">'+ '<span class="canceled">***</span>' + ' </td> <td class="bigData">'+cleanUpSpecialChars(station)+' </td> <td class="smallData">'+type+' </td> <td class="smallData">'+platform+' </td> </tr>');
    }
    else{
      $('.dataTable')
      .append('<tr> <td class="smallData">'+getTimeFromDate(time)+ ' <span class="delay">'+ delay +'</span>' + ' </td> <td class="bigData">'+cleanUpSpecialChars(station)+' </td> <td class="smallData">'+type+' </td> <td class="smallData">'+platform+' </td> </tr>');
    }
  });
}


function pad(num) { 
  return ("0"+num).slice(-2);
}

function getTimeFromDate(timestamp) {
  var date = new Date(timestamp * 1000);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();
  return pad(hours)+":"+pad(minutes)/*+":"+pad(seconds)*/
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}