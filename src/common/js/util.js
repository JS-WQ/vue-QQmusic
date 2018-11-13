function getRandomIndex(min,max){
    return Math.floor(Math.random()*(max - min + 1) + min)
}

export function getRandomArr(arr){
    let _arr = arr.slice()
    for(let i=0;i<arr.length;i++){
        let j = getRandomIndex(0,i)
        let iArr = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = _arr
    }
    return _arr
}