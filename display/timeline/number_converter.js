function convert(num) {
  var words = ['','thousand','million','billion'];
  var backwards = String(num).split("").reverse().join("");
  var split_array = splitInto(backwards,3);
  var main = split_array[split_array.length-1].split("").reverse().join("");
  var num_triples = split_array.length;
  if (num_triples < 3) { //don't include the decimal places if it's in the hundreds or thousands
    var qualifier = '';
  }
  else {
    var sub = split_array[split_array.length-2].split("").reverse().join("");
    var qualifier = '.' + sub.substr(0,2);
  }
  var word_num = main + qualifier + " " + words[num_triples-1];
  return word_num;
}

function splitInto(str, len) {
  var regex = new RegExp('.{' + len + '}|.{1,' + Number(len-1) + '}', 'g');
  return str.match(regex );
}

