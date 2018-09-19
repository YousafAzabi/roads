exports.print = (text, milliseconds) => {
  let time = ''; // reset time to blank string
  let seconds = Math.floor(milliseconds / 1000); // calculate total seconds
  let minutes = Math.floor(seconds / 60); // calculate total minutes
  let hours = Math.floor(minutes / 60); // calculate total hours
  //format time string by checking hours, minutes and seconds
  if (hours > 0) { time = hours + 'h:'; }
  if (minutes > 0) { time = time + (minutes % 60) + 'm:'; } // % 60 to get minutes
  if (seconds > 0) { time = time + (seconds % 60) + 's'; } // % 60 to get seconds
  if (time == '') { time = 'less than a second'; } // if time less than a second
  console.log(text + time +'\n'); // print time to console
};
