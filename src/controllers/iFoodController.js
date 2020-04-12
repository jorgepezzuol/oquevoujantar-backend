const axios = require('axios').default;

module.exports = {
    
    async fetchFood(req, res) {

        const response = await axios.get('https://marketplace.ifood.com.br/v1/merchants?latitude=-23.53827&longitude=-46.22185&zip_code=08790320&page=0&channel=IFOOD&size=100&sort=&categories=&payment_types=&delivery_fee_from=0&delivery_fee_to=25&delivery_time_from=0&delivery_time_to=90');
        const data = await response.data;

        //console.log(data.merchants[0].name);
        return res.json(data);
    }
};