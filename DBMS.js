let attrO = 0;
let clo = {};
let combiClo = {};



function Closure() {
  console.clear();
  TotalFd = document.getElementById("totalFD").value;
  totalFd = TotalFd.replaceAll("->", "$").replaceAll(",", "$").split("$");
  attributes = document.getElementById("rel").value;
  attributes = attributes.split(",");
  const FD = {};
  console.log(attributes);
  for (let i = 0; i < totalFd.length; i++) {
    if (!(totalFd[i] in FD)) {
      if (attributes.includes(totalFd[i])) FD[totalFd[i]] = totalFd[i + 1];
      else if (totalFd[i].length > 1) {
        totalfd = totalFd[i].split("*");
        const result = totalfd.every((val) => attributes.includes(val));
        if (result) {
          FD[totalFd[i]] = totalFd[i + 1];
        }
      }
    } else if (attributes.includes(totalFd[i])) {
      FD[totalFd[i]] = FD[totalFd[i]] + "*" + totalFd[i + 1];
    }
    i++;
  }
  console.log(FD);

  closure = new Set();
  attri = document.getElementById("findattr").value;
  checkattr = [];

  if (attri.length == 1) {
    if (attributes.includes(attri)) {
      closure.add(attri);
      checkattr.push(attri);
    }
  } else {
    attr = attri.split("*");
    for (let atr in attr) {
      if (attributes.includes(attr[atr])) {
        closure.add(attr[atr]);
        checkattr.push(attr[atr]);
      }
    }
  }

  while (checkattr.length != 0) {
    if (FD[checkattr[0]] != undefined && FD[checkattr[0]].length == 1) {
      if (attributes.includes(FD[checkattr[0]])) closure.add(FD[checkattr[0]]);
      checkattr.push(FD[checkattr[0]]);
      checkattr.shift();
    }

    if (FD[checkattr[0]] == undefined) {
      checkattr.shift();
    } else if (FD[checkattr[0]] != undefined && FD[checkattr[0]].length > 1) {
      partition = FD[checkattr[0]].split("*");
      checkattr.shift();
      for (let i = 0; i < partition.length; i++) {
        if (attributes.includes(partition[i])) closure.add(partition[i]);

        if (partition[i] in FD) {
          checkattr.push(partition[i]);
        }
      }
    }
  }
  for (const fd in FD) {
    if (fd.length > 1) {
      chkfd = fd.split("*");
      const result1 = chkfd.every((val) => closure.has(val));
      if (FD[fd].length == 1) result2 = attributes.includes(FD[fd]);
      else {
        result2 = FD[fd].split("*").map((val) => attributes.includes(val));
      }

      console.log(chkfd, result1, result2);

      if (result1 && result2) {
        FD[fd].split("*").map((val) => closure.add(val));
      }
    }
  }
  let myarr = [];
  for (let element of closure) {
    myarr.push(element);
  }
  myarr.sort();
  closure.clear();
  for (let element of myarr) {
    closure.add(element);
  }

  console.log(closure);

  const iterator = closure.values();
  let text = "{";
  for (const entry of iterator) {
    text += entry + ",";
  }
  text = text.slice(0, -1);
  text += "}";
  document.getElementById("closure").innerHTML =
    "THE CLOSURE OF (" + attri + ")+" + " is " + text;
}

// FD array, checker combination
function findCLO(arr, p) {
  let index = [];
  let str3 = p;
  for (let i = 0; i < arr.length; i++) {
    if (existornot(str3, arr[i][0])) {
      str3 += arr[i][1];
    } else {
      index.push(i);
    }
  }

  let l = index.length;

  for (let i = 0; i < index.length; i++) {
    if (existornot(str3, arr[index[i]][0])) {
      str3 += arr[index[i]][1];
      index.splice(i, 1);
    }
  }

  while (l != index.length) {
    l = index.length;
    for (let i = 0; i < index.length; i++) {
      if (existornot(str3, arr[index[i]][0])) {
        str3 += arr[index[i]][1];
        index.splice(i, 1);
      }
    }
  }

  combiClo[p] = str3;
}

// code for finding the candidate key of the given FDs
function CK() {
  console.clear();
  console.log("hi");

  //code for fetching the data from the input given
  TotalFd = document.getElementById("ckfd").value;
  totalFd = TotalFd.replaceAll("->", "$").replaceAll(",", "$").split("$");
  attributes = document.getElementById("rela").value;

  // relation string for further comparison
  let attr = attributes.replaceAll(",", "");
  console.log(attr);

  let totFD = [];
  for (let i = 0; i < totalFd.length; i = i + 2) {
    totFD.push([totalFd[i], totalFd[i + 1]]);
  }

  let str = attr;
  let count = Math.pow(2, str.length);
  console.log(count);

  for (let i = 1; i < count; i++) {
    let comb = "";
    for (let j = 0; j < str.length; j++) {
      let number = 1;
      number = number << j;
      number = number & i;
      if (number != 0) {
        comb += str[j];
      }
    }

    combiClo[comb] = comb;
  }

  for (const item in combiClo) {
    findCLO(totFD, item);
    if (existornot(combiClo[item], attr)) {
      combiClo[item] = attr;
    } else {
      delete combiClo[item];
    }
  }
    console.log(combiClo);
    console.log(totFD);
  for (const item in combiClo) {
    for (const it in combiClo) {
      if (item != it) {
        if (existornot(it, item)) {
          delete combiClo[it];
        }
      }
    }
  }

  console.log(combiClo);

  let ans = "{ ";
  for (const item in combiClo) {
    ans += item + " , ";
  }

  ans = ans.substring(0, ans.length - 2) + "}";
  document.getElementById("candi").innerHTML =
    "The Candidate Keys are : " + ans;
}

// string of closure, checker
function existornot(str3, c) {
  let flag = true;
  for (let i = 0; i < c.length; i++) {
    if (str3.indexOf(c[i]) == -1) {
      flag = false;
      break;
    }
  }

  return flag;
}

// array, index
function closureOF(arr, ind) {
  let str1 = arr[ind][0]; // left

  let index = [];
  let str3 = str1; // closure string
  for (let i = 0; i < arr.length; i++) {
    if (i != ind) {
      if (existornot(str3, arr[i][0])) {
        str3 += arr[i][1];
      } else {
        index.push(i);
      }
    }
  }

  let l = index.length;

  for (let i = 0; i < index.length; i++) {
    if (existornot(str3, arr[index[i]][0])) {
      str3 += arr[index[i]][1];
      index.splice(i, 1);
    }
  }

  while (l != index.length) {
    l = index.length;
    for (let i = 0; i < index.length; i++) {
      if (existornot(str3, arr[index[i]][0])) {
        str3 += arr[index[i]][1];
        index.splice(i, 1);
      }
    }
  }

  return existornot(str3, arr[ind][1]);
}

function closureOf(arr, ind, p) {
  let index = [];
  let str3 = p;
  for (let i = 0; i < arr.length; i++) {
    if (i != ind) {
      if (existornot(str3, arr[i][0])) {
        str3 += arr[i][1];
      } else {
        index.push(i);
      }
    }
  }

  let l = index.length;

  for (let i = 0; i < index.length; i++) {
    if (existornot(str3, arr[index[i]][0])) {
      str3 += arr[index[i]][1];
      index.splice(i, 1);
    }
  }

  while (l != index.length) {
    l = index.length;
    for (let i = 0; i < index.length; i++) {
      if (existornot(str3, arr[index[i]][0])) {
        str3 += arr[index[i]][1];
        index.splice(i, 1);
      }
    }
  }

  clo[p] = str3;
}

// code for finding the cannonical cover
function find() {
  let FDs = document.getElementById("cover").value;
  console.log(FDs);

  FDs = FDs.replaceAll("->", "$").replaceAll(",", "$").split("$");
  console.log(FDs);

  // first step : making right side of the all FDs singlton
  let total_FDs = [];
  for (let i = 0; i < FDs.length; ) {
    let str1 = FDs[i];
    let str2 = FDs[i + 1];

    if (str2.length == 1) {
      total_FDs.push([str1, str2]);
    } else {
      for (let j = 0; j < str2.length; j++) {
        let c = str2[j];
        total_FDs.push([str1, c]);
      }
    }
    i += 2;
  }
  console.table(total_FDs);

  // step 2: remove redundant FDs
  for (let i = 0; i < total_FDs.length; i++) {
    if (closureOF(total_FDs, i)) {
      total_FDs.splice(i, 1);
      i--;
    }
  }

  console.table(total_FDs);

  // third step make left side to be of one

  for (let i = 0; i < total_FDs.length; i++) {
    for (j = 0; j < total_FDs[i][0].length; j++) {
      clo[total_FDs[i][0][j]] = "";
    }
    clo[total_FDs[i][1][0]] = "";
  }

  // start from here

  console.log(clo);
  for (let i = 0; i < total_FDs.length; i++) {
    if (total_FDs[i][0].length > 1) {
      for (j = 0; j < total_FDs[i][0].length; j++) {
        let p = total_FDs[i][0][j];
        closureOf(total_FDs, i, p);
        for (k = 0; k < total_FDs[i][0].length; k++) {
          if (k != j) {
            if (existornot(clo[p], total_FDs[i][0][k])) {
              total_FDs[i][0] =
                total_FDs[i][0].substring(0, k) +
                total_FDs[i][0].substring(k + 1);
            }
          }
        }
      }
    }
  }

  console.table(total_FDs);

  for (let i = 0; i < total_FDs.length - 1; i++) {
    for (let j = i + 1; j < total_FDs.length; j++) {
      if (total_FDs[i][0] == total_FDs[j][0]) {
        total_FDs[i][1] += total_FDs[j][1];
        total_FDs.splice(j, 1);
        j--;
      }
    }
  }

  console.table(total_FDs);

  let ans = "{ ";
  for (let i = 0; i < total_FDs.length; i++) {
    if (i != total_FDs.length - 1)
      ans += total_FDs[i][0] + "&#8594;" + total_FDs[i][1] + " , ";
    else ans += total_FDs[i][0] + "&#8594;" + total_FDs[i][1];
  }
  ans += " }";

  document.getElementById("CannonicalCover").innerHTML =
    "The Canonical Cover is " + ans;
}
