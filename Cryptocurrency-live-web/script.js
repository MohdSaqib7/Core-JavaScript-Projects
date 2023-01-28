const trendingCoinsSlideshow = document.getElementById('trending-coin-slideshow')
const searchInputBitcoin =  document.getElementById('search-input-bitcoin');
const searchBitcoinButton = document.getElementById('search-bitcoin-button');
const coinContainer = document.getElementById('coin-container');
const coinInfoHeading = document.getElementById('coin-info-heading')
const coinInfoLogo = document.getElementById('coin-info-logo')
const coinInfoParagraph = document.getElementById('coin-info-paragraph')
const coinInfoPrices = document.getElementsByClassName('coin-info-prices')

init()
function init() {
    if(window.location.pathname.includes('index')){
        getTrendingCoins()

    }else if(window.location.pathname.includes('search')){
        // serachCoins() 
        searchBitcoinButton.addEventListener('click', serachCoins)

    }else if(window.location.pathname.includes('moreInfo')){
        const coinId = new URLSearchParams(window.location.search).get('id')
        getCoinInfo(coinId)
        createChart(coinId)
    }  
}

//--------------------------------------------- Slidshow -----------------------------------------------------
function scrollAnimation() {
    let count = 0
    let flag = true;
    setInterval(() => {
        const endPoint = trendingCoinsSlideshow.scrollWidth - trendingCoinsSlideshow.offsetWidth
        if(flag){
            count += 1
            if(count===endPoint){
                flag = false
            }
        }else{
            count -= 1
            if(count===0){
                flag = true
            }
        }
        console.log(count)
        trendingCoinsSlideshow.scrollTo(count, 0)
    }, 20)
    
}

// -----get all trending coins------
async function getTrendingCoins() {
    const res = await fetch('https://api.coingecko.com/api/v3/search/trending')
    const jsonData = await res.json()
    const bitcoinValue = await getBitcoinValue()
    const coins = jsonData.coins
    let html = ""
    for (let i = 0; i < coins.length; i++) {
        const coinName = coins[i].item.name
        const coinPrice = coins[i].item.price_btc * bitcoinValue
        const coinSymbol = coins[i].item.symbol
        const coinIconUrl = coins[i].item.small
        html += `<div class="trending_coin_container">
        <img src="${coinIconUrl}" class="coin-logo" alt="coin logo" />
        <div class="coin-info">
          <h1 class="coin-name">${coinName} (${coinSymbol})</h1>
          <h4 class="coin-price">Rs ${coinPrice.toFixed(4)}</h4>
        </div>
      </div>`
    }
    trendingCoinsSlideshow.innerHTML = html
    scrollAnimation()
}

// -----Bitcoin value in INR-----
async function getBitcoinValue() {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr')
    const jsonData = await res.json()
    return jsonData.bitcoin.inr
}


//------------------------------------------ Search coin -----------------------------------------------------
async function serachCoins(){
    const apiResponse = await fetch(`https://api.coingecko.com/api/v3/search?query=${searchInputBitcoin.value}`)
    const jsonData = await apiResponse.json()
    let html = ""
    for(let i=0; i<jsonData.coins.length; i++){
        const coin = jsonData.coins[i]
        html += `<div class="coin-box">
                    <div class="coin-information">
                        <h3 class="sr-no">${i+1}</h3>
                        <img class= "coin-symbol" src="${coin.large}" alt="coin" />
                        <h2 class="coin-title">${coin.name} ${coin.symbol}</h2>
                    </div>
                    <a href="./moreInfo.html?id=${coin.id}"><button class="more-info-button" type="button">More Info</button></a>
                </div>`
    }
    coinContainer.innerHTML = html

}


//----------------------------- More info about coin include chart --------------------------------------------

async function getCoinInfo(coinId) {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
    const jsonData = await res.json()

    coinInfoLogo.setAttribute('src', jsonData.image.large)
    coinInfoHeading.innerText = `${jsonData.name} (${jsonData.symbol.toUpperCase()})`
    coinInfoPrices[0].innerText = `₹ ${jsonData.market_data.current_price.inr}`
    coinInfoPrices[1].innerText = `$ ${jsonData.market_data.current_price.usd}`
    coinInfoPrices[2].innerText = `€ ${jsonData.market_data.current_price.eur}`
    coinInfoPrices[3].innerText = `£ ${jsonData.market_data.current_price.gbp}`
    coinInfoParagraph.innerHTML = jsonData.description.en
}



async function createChart(coinId) {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=inr&days=1&interval=hourly`)
    const jsonData = await res.json()
    const xValues = [];
    const yValues = [];
    for(const price of jsonData.prices) {
        const d = new Date(0)
        d.setUTCMilliseconds(price[0])
        xValues.push(`${d.getHours()}:${d.getMinutes()}`)
        yValues.push(price[1])
    }
    new Chart('coin-graph',{
        type: 'line',
        data: {
            labels: xValues,
            datasets: [
                {
                    label: 'Price',
                    pointRadius: 4,
                    data: yValues,
                    fill: false,
                    borderColor: '#34a4eb'
                }
            ]
        }
    })
}