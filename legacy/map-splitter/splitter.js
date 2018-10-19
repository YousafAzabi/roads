//
splitMap = (id, arr) => {
  let [x1, y1, x2, y2] = arr;
  let ogrClip = ' -clipdst ' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2;
  let output = outPath.trim() + fileTag + id + '.json '; // output file name
  let input = outPath.trim() + fileTag + Math.floor(id / 2) + '.json';
  ogrCommand = ogrJSON + output + input + ogrClip;
  segArray[id] = arr
  console.log( ' Now processing Area: ' + id);
  commandLine(id, ogrCommand, function(i) {
    console.log(' Area number ' + i + ' finished in: \t' +
                  tm.print(new Date() - timer[i]) + '\n');
    if (i < segements) {
      setMapDimensions(i);
    }
    //check file to be deleted
    let tempIndex = Math.floor(i / 2);
    if ( (++ checkFile[tempIndex]) == 2) {
      let file = outPath.trim() + fileTag + tempIndex + '.json';
      exec('rm ' + file, (error,stdout,stderr) => {
        if (error) {
          console.error('exec error: ' + error);
        }
        console.log('File ' + file +  'has been deleted.');
      });
    }
    if(++ checkFile[0] >= (Math.pow(2, segements + 1) - 2) ) {
      tm.print('\t\tTotal time taken: \t', new Date() - totalTime);
    }
  }); // call function
}
