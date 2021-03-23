import { createStore } from 'vuex'

export default createStore({
  state: {
    countyData: [],
    countyId: [],
  },
  getters: {
  },
  mutations: {
    setCountyData (state, payload){
      state.countyData = payload;
    },
    setCountyId (state, payload){
      state.countyId = payload;
    }
  },
  actions: {
    async fetchCountyData ({commit}){
      const res = await fetch("https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-4D24F5BE-73F7-485A-94A0-AB7B5E86D535&format=JSON")
      .then(res => res.json())
      .then(res => {
        return Object.keys(res["records"].location).map(key => res["records"].location[key]);
      });
      console.log(res);
      commit('setCountyData', res);
    },
    async fetchCountyId (){
      const res = await fetch("../../../twMapId.json");
      console.log(res);
    }
  },
  modules: {
  }
})
