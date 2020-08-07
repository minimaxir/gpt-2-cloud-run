//so the weather station updates about once every five minutes, so its definitely accurate

//so what i want to do is check... yeah, actually, how DO i want to structure this?
//i think the "changes" should be relative to... this day and the previous day? would that really work if there's so much data...
//what i could do is... there needs to be some statistics involved here.
//map definitely needs to be used. question is, what am i mapping between?
//the past week seems fine, right? then take the most recent data point.
//5 minutes into seven days... 5 minutes is 120 times per hour. 
//2880 times per day
//20160 times per week. that's... doable, though it'd need to load.

//so we want to find the min and the max and map those between... whatever we decide. 
//then use the mapped value as the speed of the rain and clouds. :3
//then change the colors...

//FOR MOVING THE SUN 
//god do i need to find the like index of the timestamp... this timestamp is formatted v poorly
//it starts at the 12th 1

//so i guess i could turn them into dates and then... get the hours and... minutes part from the date. then i need to turn them into point things.
//i can remap the minutes from 0 to 1. then... add them to the hours?

//well, whats next. most important is to fix the sun angle. i want the highest point of the sun to be... yeah, like 200 pixels below the height 
//of the screen. so it'd be making an ellipse angle based on that. im sure it's doable bc theres only one path an ellipse can take to go through 
//a set of four points, assuming it's still an ellipse.

//after sun angle, stars and moon. then we'll see, gotta add the spaces for input at some point.

let canvas;

function dateConverter(array,newArray) {
    for (let i = 0; i<array.length; i++) {
      let date = new Date(array[i]);
      let minutes = date.getMinutes();
      if (minutes < 10) {
        minutes = `.0${minutes}`; 
      } else {
        minutes = `.${minutes}`;
      }
      newArray[i] = Number(`${date.getHours()-4}`+minutes);
      }    
    return newArray;
}
  
  function mapper(array,mappedArray,lower,upper,constraint = 0) {
    console.log("hewf0");
    let maxValue = max(array);
    let minValue = min(array);
    for (let i =0; i<array.length; i++) {
      if (constraint != 0) {
        let mappedValue = constrain(map(array[i],minValue,maxValue,lower,upper,true),-1,constraint);
        mappedArray[i] = mappedValue;
      } else {
        let mappedValue = map(array[i],minValue,maxValue,lower,upper,true);
        mappedArray[i] = mappedValue;
      }
    }
    console.log("hewf");
  }
  
  let url = 'https://tigoe.io/itpower-data';
  let macID = 'F8:F0:05:F5:F8:51';
  let sessionKey = '90764572';
  let path = 'https://tigoe.io/itpower-data?macAddress=F8:F0:05:F5:F8:51&sessionKey=90764572';
  
  // make arrays to save each weather data
  let wind_dir = [];
  
  let winddir_avg2m = [];
  
  let windspeedmph = [];
  let mappedwindspeed = [];
  
  let rainin = [];
  let mappedrainin = [];
  
  let dailyrainin = [];
  
  let temperature = [];
  let mappedtemp = []
  
  let humidity = [];
  
  let pressure = [];
  
  let illuminance = [];
  let mappedillu = [];
  
  let uva = [];
  let uvb = [];
  let uvindex = [];
  
  let recorded_at= [];
  let recordedtime = [];
  
  function preload() {
    path = url + "?macAddress=" + macID + "&sessionKey=" + sessionKey;
    //httpDo(path, 'GET', readResponse);
    httpDo(path, 'GET', function(response) {
        // get response as a JSON object
    let data = JSON.parse(response);
    
    // parse weather data and save them into each array
    for (i=0; i<data.length; i++) {
      recorded_at.push(data[i].recorded_at);
      wind_dir.push(data[i].wind_dir);
      winddir_avg2m.push(data[i].winddir_avg2m);
      windspeedmph.push(data[i].windspeedmph);
      rainin.push(data[i].rainin);
      dailyrainin.push(data[i].dailyrainin);
      temperature.push(data[i].temperature);
      humidity.push(data[i].humidity);
      pressure.push(data[i].pressure);
      illuminance.push(data[i].illuminance);
      uva.push(data[i].uva);
      uvb.push(data[i].uvb);
      uvindex.push(data[i].uvindex);
    }    

    document.getElementById("rain").innerHTML = "Rain: "+rainin[rainin.length-1]+" inches";
    document.getElementById("time").innerHTML = "Time: "+recorded_at[recorded_at.length-1];
    document.getElementById("wind").innerHTML = "Wind Speed: "+windspeedmph[windspeedmph.length-1]+" mph";
    document.getElementById("temperature").innerHTML = "Temperature: "+temperature[temperature.length-1]+" C";
    document.getElementById("humidity").innerHTML = "Humidity: "+humidity[humidity.length-1]+" %";
    document.getElementById("pressure").innerHTML = "Pressure: "+pressure[pressure.length-1];

    mapper(windspeedmph,mappedwindspeed,0.1,5);
    mapper(rainin,mappedrainin,0,2000);
    recordedtime = dateConverter(recorded_at,recordedtime);
    finalAngle = map(recordedtime[recordedtime.length-1],min(recordedtime),max(recordedtime),PI,2*PI);
    })
  }

  //------------------------------------//
  //--------------SUN-------------------//
  //------------------------------------//
  /*
  θ=arctan2(cx−x,cy−y)×180/π+90∘
  It gives you angle from 0∘ to 270∘ .

  If θ<0∘ then θ=360∘+θ.
  let newAngle = atan(2*(width/2-0,height-height))
  IM NOT LOOKING FOR THE ANGLE IM LOOKING FOR THE XY OF THE FINAL ANGLE

  ok, here's the problem.
  i want the minor radius (the sun's zenith) to always be, say, height/12. the major radius will always be width. (depending on how the window 
    is resized tho)

  this.newAngleMove = function() {
    if (width/2) > (height - height/12) {
      this.a = width/2;
      this.b = height-height/12;
    } else {
      this.a = height-height/12;
      this.b = width/2;
    }

    if (this.angle < finalAngle) {
      this.angle += this.speed;
      this.speed = finalAngle/(pow(this.angle,5.3));
    } 

    this.x = (a*b) / sqrt((b*b) + ((a*a)*pow(tan(angle),2)));
    this.y = (a*b) / sqrt((a*a) + ((b*b)/pow(tan(angle),2)));

    noStroke();
    fill("#FFC914");
    circle(this.x,this.y,this.r);
  }

  */
  let theSun;
  let finalAngle;

  function Sun(y,r) {
    this.initialX = 0;
    this.initialY = height-100;
    this.x = this.initialX;
    this.y = this.initialY;
    this.angle = PI;
    this.r = 100;
    this.speed = 0.0001
    this.a = null;
    this.b = null;
    
    this.angleMove = function() {
      if (this.angle < finalAngle) {
        this.angle += this.speed;
        this.speed = finalAngle/(pow(this.angle,5.3));
      } 
      let distX = dist(this.initialX,this.initialY,width/2,height);
      let distY = sqrt(pow(this.initialX-width/2,2)+pow(this.initialY-height,2))
      this.x = width/2 + cos(this.angle) * distX;
      this.y = height + sin(this.angle) * distY;
      noStroke();
      fill("#FFC914");
      circle(this.x,this.y,this.r);
    }

    this.newAngleMove = function() {
      if ((width/2) > (height - height/12)) {
        this.a = width/2;
        this.b = height-height/12;
      } else {
        this.a = height-height/12;
        this.b = width/2;
      }
  
      if (this.angle < finalAngle) {
        this.angle += this.speed;
        this.speed = finalAngle/(pow(this.angle,5.3));
      } 
  
      this.x = (this.a*this.b) / sqrt((this.b*this.b) + ((this.a*this.a)*pow(tan(this.angle),2)));
      this.y = (this.a*this.b) / sqrt((this.a*this.a) + ((this.b*this.b)/pow(tan(this.angle),2)));
  
      noStroke();
      fill("#FFC914");
      circle(this.x,this.y,this.r);
    }
  }

  //------------------------------------//
  //--------------MOON-------------------//
  //------------------------------------//
 let theMoon;

 function Moon(y,r) {
   /*
   so what do we need for the moon
   just make the x and y and angle and stuff based on the sun, right?
   */
   this.initialX = width;
   this.initialY = height + 100;
   this.x = this.initialX;
   this.y = this.initialY;
   this.angle = theSun.angle + PI;
   this.r = 100;
   this.speed = 0.0001
   this.a = null;
   this.b = null;
   
   this.angleMove = function() {
     if (this.angle < finalAngle) {
       this.angle += this.speed;
       this.speed = finalAngle/(pow(this.angle,5.3));
     } 
     let distX = dist(this.initialX,this.initialY,width/2,height);
     let distY = sqrt(pow(this.initialX-width/2,2)+pow(this.initialY-height,2))
     this.x = width/2 + cos(this.angle) * distX;
     this.y = height + sin(this.angle) * distY;
     noStroke();
     fill("#FFC914");
     circle(this.x,this.y,this.r);
   }

   this.newAngleMove = function() {
     if ((width/2) > (height - height/12)) {
       this.a = width/2;
       this.b = height-height/12;
     } else {
       this.a = height-height/12;
       this.b = width/2;
     }
 
     if (this.angle < finalAngle) {
       this.angle += this.speed;
       this.speed = finalAngle/(pow(this.angle,5.3));
     } 
 
     this.x = (this.a*this.b) / sqrt((this.b*this.b) + ((this.a*this.a)*pow(tan(this.angle),2)));
     this.y = (this.a*this.b) / sqrt((this.a*this.a) + ((this.b*this.b)/pow(tan(this.angle),2)));
 
     noStroke();
     fill("#FFC914");
     circle(this.x,this.y,this.r);
   }
 }
  
  //------------------------------------//
  //-------------RAIN-------------------//
  //------------------------------------//
  let drops = []
  
  function Drop() {
    this.x = random(0, width+200);
    this.initialX = this.x;
    this.y = random(0, -height);
    
    this.show = function() {
      noStroke();
      fill("#D8F0ED");
      ellipse(this.x, this.y, random(1, 4), random(1, 4));   
    }
    this.update = function() {
      this.speed = random(5, 10);
      this.gravity = 1.5;
      this.y = this.y + this.speed*this.gravity; 
      this.x += -2;
      
      if (this.y > height) {
        this.y = random(0, -height);
        this.x = this.initialX;
        this.gravity = 0;
  }
  }
  }
  
  let clouds = [];
  
  function cloud(size,position) {
    fill(256, 150);
    noStroke();
    quad(position[0]-size,
         position[1],
         position[0],
         position[1]-size/2,
         position[0]+size,
         position[1],
         position[0],
         position[1]+size/2
         );
  }
  
  function Cloud(size, position, speed) {
    
    this.size = size;
    this.position = position;
    this.speed = 1;
    
    this.display = function(){
      cloud(this.size, this.position);
      this.position[0] += speed;
    }
  }
  
  function setup() {
    //canvas = createCanvas($(document).width(), $(document).height());
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.position(0,0);
    canvas.style('z-index','-1');
    theSun = new Sun(height/5,width/10);
  }
  
  let bgColor; 

  function draw() {
    //-----------------------------//
    //------BACKGROUND COLOR-------//
    //-----------------------------//
    fromBG = color("#7BB2D9");
    toBG = color("#031C34");
    //-----------------------------//
    //------TRIANGLE COLORS--------//
    //-----------------------------//
    let BTColor1;
    let BTColor2;
    let TColor1;
    let TColor2;
    let FTColor1;
    let FTColor2;

    if (theSun.angle/PI < 1.5) {
      bgColor = lerpColor(toBG,fromBG,(theSun.angle-PI)/(PI/2));
      BTColor1 = lerpColor(color("#353544"),color("#3E5899"),(theSun.angle-PI)/(PI/2));
      BTColor2 = lerpColor(color("#3E5899"),color("#353544"),(theSun.angle-PI)/(PI/2));

      TColor1 = lerpColor(color("#3D665C"),color("#3C4C39"),(theSun.angle-PI)/(PI/2));
      TColor2 = lerpColor(color("#3C4C39"),color("#3D665C"),(theSun.angle-PI)/(PI/2));

      FTColor1 = lerpColor(color("#578B8D"),color("#95C2A6"),(theSun.angle-PI)/(PI/2));
      FTColor2 = lerpColor(color("#95C2A6"),color("#578B8D"),(theSun.angle-PI)/(PI/2));
    } else {
      bgColor = lerpColor(fromBG,toBG,cos(theSun.angle));
      BTColor1 = lerpColor(color("#3E5899"),color("#353544"),cos(theSun.angle));
      BTColor2 = color("#353544")

      TColor1 = color("#3C4C39");
      TColor2 = lerpColor(color("#3D665C"),color("#3C4C39"),cos(theSun.angle));

      FTColor1 = lerpColor(color("#95C2A6"),color("#578B8D"),cos(theSun.angle));
      FTColor2 = color("#578B8D");
    }
    background(bgColor);
    
    let tx1 = -100;
    let ty1 = height;
    let tx2 = width/2+tx1;
    let ty2 = height/4;
    let tx3 = width/2+tx2;
    let ty3 = height;
    
    noStroke();
    
    //-------------SUN MOVES HERE--------------//
    theSun.angleMove();
    
    //background triangle 1
    let bt1x2 = width/5;
    let bt1x1 = bt1x2 - width/6;
    let bt1x3 = bt1x2 + width/8;
    //let lightColor1 = "#353544";
    //let darkColor1 = "#3E5899";
    //side 1
    fill(BTColor1);
    triangle(bt1x1, ty1, bt1x2, height/3, bt1x3, ty3);
    //side 2 
    fill(BTColor2);
    triangle(bt1x1, ty1, bt1x2, height/3, bt1x3-(bt1x3-bt1x1)/3, ty3);
    
    //background triangle 2 
    let bt2x2 = bt1x2/2;
    let bt2x1 = bt2x2 - width/4;
    let bt2x3 = bt2x2 + width/6;
    //side 1
    fill(BTColor1);
    triangle(bt2x1, ty1, bt2x2, height/2.3, bt2x3, ty3);
    //side 2
    fill(BTColor2);
    triangle(bt2x1, ty1, bt2x2, height/2.3, bt2x3-(bt2x3-bt2x1)/1.5, ty3);
    
    //first triangle
    //side 1
    fill(TColor2);
    triangle(tx1, ty1, tx2, ty2, tx3, ty3);
    //side 2
    fill(TColor1);
    triangle(tx1, ty1, tx2, ty2, tx3-((tx3-tx1)/1.5), ty3);
    
    //rain 
    if (mappedrainin[mappedrainin.length-1] > 0) {
      if (!(drops.length > 0)) {
        for(let i = 0; i < mappedrainin[mappedrainin.length-1]*10; i++) {
          drops[i] = new Drop();
        }
      }
    }
    for(let i = 0; i < drops.length; i++) {
      drops[i].show();
      drops[i].update();
    }
    
    //second triangle
    let t3x2 = tx2+(tx2/10);
    let t3x1 = t3x2-width/6;
    let t3x3 = t3x2+width/8;
    //side 1
    fill(FTColor1);
    triangle(t3x1,ty1,t3x2,ty2*2.2,t3x3,ty3);
    //side 2
    fill(FTColor2);
    triangle(t3x1,ty1,t3x2,ty2*2.2,t3x3-(t3x3-t3x1)/1.4,ty3);
    
    //third triangle
    let t2x1 = tx2+(tx2/7);
    let t2x2 = t2x1 + width/8;
    let t2x3 = t2x2 + width/6;
    //side 1
    fill(FTColor1);
    triangle(t2x1, ty1, t2x2, ty2+height/2, t2x3, ty3);
    //side 2
    fill(FTColor2);
    triangle(t2x1, ty1, t2x2, ty2+height/2, t2x3-((t2x3-t2x1)/3), ty3);
    
    //fourth triangle
    let t4x2 = tx2 - width/6;
    let t4x1 = t4x2 - width/7;
    let t4x3 = t4x2 + width/8;
    //side 1 
    fill(FTColor1);
    triangle(t4x1, ty1, t4x2, ty2+height/2.5, t4x3, ty3);
    //side 2 
    fill(FTColor2);
    triangle(t4x1, ty1, t4x2, ty2+height/2.5, t4x3-(t4x3-t4x1)/1.3, ty3);
    
    //clouds 
    //higher speed = higher chance of clouds spawning
    if (clouds.length < 10) {
      if (random(0,7000*(mappedwindspeed[mappedwindspeed.length-1])) < 1) {
        clouds.push(new Cloud(random(50,70),[random(-100, -50),random(60,height/2)],mappedwindspeed[mappedwindspeed.length-1]));
      }
    }
    for (let i=0; i<clouds.length; i++) {
      clouds[i].display();
      if (clouds[i].position[0] > width+100) {
        clouds.splice(i,1);
      }
    }
    //console.log(theSun.angle);
  }
  
  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    mapper(windspeedmph,mappedwindspeed,0.1,5);
    mapper(rainin,mappedrainin,0,2000);
  }