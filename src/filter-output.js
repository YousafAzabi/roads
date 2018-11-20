const fs = require('fs');

filterOutput = () => {
  const fileName = './temp/onewayLondonOS.json';
  let data = JSON.parse(fs.readFileSync(fileName).toString());
  let features = data.features;
  for (let i = 1; i < features.length; i++){
    if (features[i].properties.id === features[i-1].properties.id){
      features.splice(i,1);
    }
  }
  data.features = features;
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
}


filterOutput();
