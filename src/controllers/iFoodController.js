const axios = require("axios").default;

module.exports = {

	test(req, res) {
		console.log("oe");
	},	

	async fetchFood(req, res) {

		// PROD
		const apiUrl =
			`https://marketplace.ifood.com.br/v1/merchants?categories=${req.query.category == undefined ? "" : req.query.category}&latitude=${req.query.latitude}&longitude=${req.query.longitude}&page=0&channel=IFOOD&size=10&sort=&payment_types=&delivery_fee_from=0&delivery_fee_to=25&delivery_time_from=0&delivery_time_to=90`;

		// TEST
		//const apiUrl =
			`https://marketplace.ifood.com.br/v1/merchants?categories=${req.query.category == undefined ? "" : req.query.category}&latitude=-23.53827&longitude=-46.22185&zip_code=08790320&page=0&channel=IFOOD&size=10&sort=&payment_types=&delivery_fee_from=0&delivery_fee_to=25&delivery_time_from=0&delivery_time_to=90`;

		const promises = [];
		const foodMenu = [];

		const response = await axios.get(apiUrl);
		const data = await response.data;

		for (d of data.merchants) {

			const menuRequests = await axios
				.get(
					`https://wsloja.ifood.com.br/ifood-ws-v3/restaurants/${d.id}/menu`,
					{
						headers: {
							access_key: "69f181d5-0046-4221-b7b2-deef62bd60d5",
							secret_key: "9ef4fb4f-7a1d-4e0d-a9b1-9b82873297d8"
						},
						params: {
							restaurant: {
								id: d.id,
								name: d.name,
								distance: d.distance,
								slug: d.slug,
								detailUrl: `https://www.ifood.com.br/delivery/${d.slug}/${d.id}`,
								logo: d.resources[0]
							}
						}
					}
				)
				.catch(e => {
				});

			promises.push(menuRequests);
		}

		await Promise.all(promises)
			.then(results => {
				for (r of results) {
					for (m of r.data.data.menu) {
						for (i of m.itens) {
							i.restaurant = r.config.params.restaurant;
							foodMenu.push(i);
						}
					}
				}
			})
			.catch(e => {
			});

		return res.json(foodMenu);
	}
};
