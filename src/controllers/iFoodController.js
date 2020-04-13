const axios = require("axios").default;

module.exports = {
	async fetchFood(req, res) {
		// latitude=-23.53827&longitude=-46.22185&categories=
		const apiUrl =
			"https://marketplace.ifood.com.br/v1/merchants?latitude=-23.53827&longitude=-46.22185&zip_code=08790320&page=0&channel=IFOOD&size=10&sort=&categories=&payment_types=&delivery_fee_from=0&delivery_fee_to=25&delivery_time_from=0&delivery_time_to=90";

        const promises = [];
        const foodMenu = [];

		const response = await axios.get(apiUrl);
		const data = await response.data;

		for (d of data.merchants) {

            let fileName = "";
            let resources = d.resources[0];

            if(resources.hasOwnProperty('fileName')) {
                fileName = `https://static-images.ifood.com.br/image/upload/f_auto,t_thumbnail/logosgde/${resources.fileName}`;
            }

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
                                name: d.name,
                                distance: d.distance,
                                slug: d.slug,
                                detailUrl: `https://www.ifood.com.br/delivery/${d.slug}/${d.id}`,
                                fileName: fileName
                            }
                        }
					}
				)
				.catch(e => {
					console.log(e);
					//res.end()
                });
                
			promises.push(menuRequests);
		}

		await Promise.all(promises)
			.then(results => {
				
				for (r of results) {
					for (m of r.data.data.menu) {
						for (i of m.itens) {

                            restaurant = r.config.params.restaurant;

							if(i.logoUrl != undefined) {
							    i.logoUrl = `https://static-images.ifood.com.br/image/upload/f_auto,t_high/pratos/${i.logoUrl}`;
							}
							else {
							    i.logoUrl = restaurant.fileName;
                            }
                            i.restaurant = restaurant;
							foodMenu.push(i);
						}
					}
				}
			})
			.catch(e => {
                //Promise.reject(Error("oops"));
                //console.log(e);
			});
        
        return res.json(foodMenu);
	}
};
