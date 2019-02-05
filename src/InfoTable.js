import React, { Component } from 'react';

export class InfoTable extends Component {
  render() {
    const infosRaw = this.props.infos.RAW;
    // const infosDisplay = this.props.infos.DISPLAY;
    // const coinNames = Object.keys(infosRaw);
    const coinNames = [];

    const colorValues = [];
    const rankValues = [];
    const imageValues = [];
    const nameValues = [];
    const symbolValues = [];
    const priceValues = [];
    const marketCapValues = [];
    const volume24Values = [];
    const supplyValues = [];
    const changeValues = [];

    this.props.infos.forEach((coin, i) => {
      coinNames.push(coin.CoinInfo.Name);
      rankValues.push(i + 1);
      imageValues.push(coin.CoinInfo.ImageUrl);
      nameValues.push(coin.CoinInfo.FullName);
      symbolValues.push(
        `${coin.RAW[this.props.currency].FROMSYMBOL} (${coin.DISPLAY[this.props.currency].FROMSYMBOL})`
      );
      priceValues.push(coin.DISPLAY[this.props.currency].PRICE);
      marketCapValues.push(coin.DISPLAY[this.props.currency].MKTCAP);
      volume24Values.push(coin.DISPLAY[this.props.currency].VOLUME24HOURTO);
      supplyValues.push(coin.DISPLAY[this.props.currency].SUPPLY);
      changeValues.push(coin.DISPLAY[this.props.currency].CHANGEPCT24HOUR);
    });

    this.props.color.domain(coinNames);

    coinNames.forEach(coin => {
      colorValues.push(this.props.color(coin));
    });

    return (
      <div>
        <div id="infoTable" className="table m-mg-xs-b">
          <div className="table__cell m-fx-cl-sh-sh m-tx-c">
            <div className="table-title m-secondary">#</div>
            {rankValues.map((value, i) => (
              <div key={i} className="table-value m-pd-xt-t">
                <span className="m-dp-bk" style={{ backgroundColor: colorValues[i], color: 'white' }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div className="table__cell m-fx-cl-sh-sh">
            <span className="table-title m-secondary m-pd-xt-l">Name</span>
            {nameValues.map((value, i) => (
              <span key={i} className="table-value m-pd-xt-t m-pd-xt-l m-fx-st-c">
                <img
                  className="coin-logo m-mg-xt-r"
                  src={`https://www.cryptocompare.com${imageValues[i]}`}
                  alt={nameValues[i]}
                />
                {value}
              </span>
            ))}
          </div>
          <div className="table__cell m-fx-cl-sh-sh">
            <span className="table-title m-secondary">Symbol</span>
            {symbolValues.map((value, i) => (
              <span key={i} className="table-value m-pd-xt-t">
                {value}
              </span>
            ))}
          </div>
          <div className="table__cell m-fx-cl-sh-sh">
            <span className="table-title m-secondary m-tx-r m-pd-xt-r">Price</span>
            {priceValues.map((value, i) => (
              <span key={i} className="table-value m-pd-xt-t m-pd-xt-r m-al-en">
                {value}
              </span>
            ))}
          </div>
          <div className="table__cell m-fx-cl-sh-sh">
            <span className="table-title m-secondary m-tx-r m-pd-xt-r">Market Cap</span>
            {marketCapValues.map((value, i) => (
              <span key={i} className="table-value m-pd-xt-t m-pd-xt-r m-al-en">
                {value}
              </span>
            ))}
          </div>
          <div className="table__cell m-fx-cl-sh-sh">
            <span className="table-title m-secondary m-tx-r m-pd-xt-r">Volume (24h)</span>
            {volume24Values.map((value, i) => (
              <span key={i} className="table-value m-pd-xt-t m-pd-xt-r m-al-en">
                {value}
              </span>
            ))}
          </div>
          <div className="table__cell m-fx-cl-sh-sh">
            <span className="table-title m-secondary m-tx-r m-pd-xt-r">Circulating Supply</span>
            {supplyValues.map((value, i) => (
              <span key={i} className="table-value m-pd-xt-t m-pd-xt-r m-al-en">
                {value}
              </span>
            ))}
          </div>
          <div className="table__cell m-fx-cl-sh-sh">
            <span className="table-title m-secondary m-tx-r m-pd-xt-r">Change (24h)</span>
            {changeValues.map((value, i) => (
              <span key={i} className="table-value m-pd-xt-t m-pd-xt-r m-al-en">
                {value < 0 ? (
                  <span className="m-tx-invalid">{value}%</span>
                ) : (
                  <span className="m-tx-valid">{value}%</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default InfoTable;
