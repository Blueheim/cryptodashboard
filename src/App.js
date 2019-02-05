import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  setScreen,
  setHover,
  setBrush,
  setCriteria,
  setCurrency,
  setCoin,
  requestHistory,
  requestInfos,
  infos$,
} from './store/actions';
import LineChart from './LineChart';
import InfoTable from './InfoTable';
import DonutChart from './DonutChart';
import Modal from './Modal';
// import worlddata from './world'

// const appdata = worlddata.features
//   .filter(d => geoCentroid(d)[0] < -20)

// appdata
//   .forEach((d,i) => {
//     const offset = Math.random()
//     d.launchday = i
//     d.data = range(30).map((p,q) => q < i ? 0 : Math.random() * 2 + offset)
//   })

// const colorScale = scaleThreshold()
//   .domain([5, 10, 20, 30])
//   .range(['#75739F', '#5EAFC6', '#41A368', '#93C464']);

const mapStateToProps = state => {
  return {
    history: state.data.history,
    infos: state.data.infos,
    isPendingHistory: state.data.isPendingHistory,
    isPendingInfos: state.data.isPendingInfos,
    criteria: state.data.criteria,
    currency: state.data.currency,
    coin: state.data.coin,
    colorScale: state.data.colorScale,
    screenWidth: state.screen.width,
    screenHeight: state.screen.height,
    hover: state.hover.hover,
    brushExtent: state.brush.brushExtent,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleScreenResize: sizes => dispatch(setScreen(sizes)),
    handleChangeHover: d => dispatch(setHover(d.id)),
    handleChangeBrush: d => dispatch(setBrush(d)),
    handleChangeCriteria: event => dispatch(setCriteria(event.target.value)),
    handleChangeCurrency: event => dispatch(setCurrency(event.target.value)),
    handleChangeCoin: event => dispatch(setCoin(event.target.value)),
    requestHistory: params => dispatch(requestHistory(params)),
    requestInfos: () => dispatch(requestInfos()),
  };
};

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.onResize = this.onResize.bind(this);
  //   this.onHover = this.onHover.bind(this);
  //   this.onBrush = this.onBrush.bind(this);
  //   // this.state = { screenWidth: 1000, screenHeight: 500, hover: 'none', brushExtent: [0, 40] };
  // }

  // onResize() {
  //   this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight - 120 });
  // }

  // onHover(d) {
  //   this.setState({ hover: d.id });
  // }

  // onBrush(d) {
  //   this.setState({ brushExtent: d });
  // }

  componentDidMount() {
    // const { handleScreenResize } = this.props;
    // window.addEventListener(
    //   'resize',
    //   handleScreenResize({ width: window.innerWidth, height: window.innerHeight - 120 }),
    //   false
    // );
    // handleScreenResize({ width: window.innerWidth, height: window.innerHeight - 120 });
    this.props.requestInfos();
    infos$.subscribe(infos => {
      if (infos) {
        const coins = infos.map(coin => {
          return coin.CoinInfo.Name;
        });
        const params = { coins: JSON.stringify(coins) };
        this.props.requestHistory(params);
      }
    });
  }

  render() {
    const {
      history,
      infos,
      isPendingHistory,
      isPendingInfos,
      criteria,
      currency,
      coin,
      colorScale,
      screenWidth,
      screenHeight,
      hover,
      brushExtent,
      handleChangeHover,
      handleChangeBrush,
      handleChangeCriteria,
      handleChangeCurrency,
      handleChangeCoin,
    } = this.props;

    const donutData = [];

    //const coins = Object.keys(infos.RAW);
    if (infos) {
      for (let coin of infos) {
        let obj = {};
        obj['coin'] = coin.CoinInfo.Name;
        obj['data'] = coin.RAW.USD;
        donutData.push(obj);
      }
    }

    //const filteredData = data.filter((d, i) => d.time >= brushExtent[0] && d.launchday <= brushExtent[1]);
    return (
      <div className="App l-app l-app--config-8">
        <div className="l-header m-primary">
          <div className="nav--bar m-pd-sm-h">
            <span className="m-wt-900 m-fs-sm">CryptoDashboard</span>
            <div className="control control-currency">
              <div className="control__select m-rd-xx m-pd-xt-l m-secondary m-sw-xt-secondary m-fx">
                <select onChange={handleChangeCurrency}>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {(isPendingInfos || isPendingHistory) && (
          <Modal>
            <div className="loading-modal m-primary">
              <div className="loader" />
              <div className="loading-box">Loading data...</div>
            </div>
          </Modal>
        )}

        <div id="main" className="l-main m-mg-sm-h m-pd-ty-t">
          {history && (
            <>
              <span className="m-wt-700 m-fs-xs m-tx-c m-tx-primary m-mg-xt-b">
                Top 5 Cryptocurrencies by Market Capitalization
              </span>
              <InfoTable infos={infos} currency={currency} color={colorScale} />
              <span className="m-wt-700 m-fs-xs  m-tx-c m-tx-primary m-mg-xt-b">
                Historical daily data - open, high, low, close, volumefrom and volumeto
              </span>
              <div className="m-fx">
                <div className="control control-coin">
                  <div className="control__select m-rd-xx m-pd-xt-l m-mg-xs-r m-secondary m-sw-xt-secondary m-fx">
                    <select onChange={handleChangeCoin}>
                      {infos.map(coin => (
                        <option key={coin.CoinInfo.Name} value={coin.CoinInfo.Name}>
                          {coin.CoinInfo.FullName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="control control-criteria">
                  <div className="control__select m-rd-xx m-pd-xt-l m-secondary m-sw-xt-secondary m-fx">
                    <select onChange={handleChangeCriteria}>
                      <option value="close">Close</option>
                      <option value="high">High</option>
                      <option value="low">Low</option>
                      <option value="open">Open</option>
                      <option value="volumefrom">volumefrom</option>
                      <option value="volumeto">volumeto</option>
                    </select>
                  </div>
                </div>
              </div>

              <LineChart
                data={history}
                size={[0, 500]}
                margin={{ top: 20, right: 30, bottom: 110, left: 90 }}
                margin2={{ top: 430, right: 20, bottom: 30, left: 90 }}
                changeBrush={handleChangeBrush}
                coin={coin}
                criteria={criteria}
                currency={currency}
                color={colorScale}
              />
            </>
          )}
        </div>
        {donutData && (
          <div className="l-bar">
            <div>
              <DonutChart
                data={donutData}
                size={[0, 250]}
                margin={{ top: 0, right: 0, bottom: 10, left: 0 }}
                title="Market Cap"
                accessorFn={d => d.data['MKTCAP']}
                keyFn={d => d.data.coin}
                color={colorScale}
              />
            </div>
            <div>
              <DonutChart
                data={donutData}
                size={[0, 250]}
                margin={{ top: 0, right: 0, bottom: 10, left: 0 }}
                title="Total Volume (24h)"
                accessorFn={d => d.data['TOTALVOLUME24HTO']}
                keyFn={d => d.data.coin}
                color={colorScale}
              />
            </div>
            <div>
              <DonutChart
                data={donutData}
                size={[0, 250]}
                margin={{ top: 0, right: 0, bottom: 10, left: 0 }}
                title="Volume (hour)"
                accessorFn={d => d.data['VOLUMEHOURTO']}
                keyFn={d => d.data.coin}
                color={colorScale}
              />
            </div>
          </div>
        )}
        <div className="l-footer m-primary m-fx-c-c m-pd-xt-v">
          Xavier Deroeux - &#9400; {new Date(Date.now()).getFullYear()}
        </div>

        {/* <StatLine allData={data} filteredData={filteredData} />
          <StreamGraph
            hoverElement={hover}
            onHover={handleChangeHover}
            colorScale={colorScale}
            data={filteredData}
            size={[screenWidth, screenHeight / 2]}
          />*/}
        {/* <Brush data={filteredData} change={handleChangeBrush} size={[screenWidth, 50]} /> */}
        {/* <WorldMap
            hoverElement={hover}
            onHover={handleChangeHover}
            colorScale={colorScale}
            data={filteredData}
            size={[screenWidth / 2, screenHeight / 2]}
          />
          <BarChart
            hoverElement={hover}
            onHover={handleChangeHover}
            colorScale={colorScale}
            data={filteredData}
            size={[screenWidth / 2, screenHeight / 2]}
          /> */}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
