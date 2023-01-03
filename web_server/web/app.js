const form = document.querySelector('form');
const price = document.querySelector('#pres');
const scale_million = 1000000;
form.addEventListener('submit', (event) => {
    try {
        fetch('http://car.vftg.xyz/predict', {
            method: 'POST',
            headers: {
                'Accepts': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                city: form.city.value,
                brand: form.brand.value,
                prod_year: parseInt(form.prod_year.value),
                color: form.color.value,
                usage: parseInt(form.usage.value),
                tpi: parseFloat(form.tpi.value),
                body_cond: form.body_cond.value,
                engine_cond: form.engine_cond.value,
                front_chassis: form.front_chassis.value,
                back_chassis: form.back_chassis.value,
                gearbox: form.gearbox.value,
            })
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)

                
                const sp = Math.round(json.price * scale_million) + '';
                let j = 0;
                let price_format = '';
                for (let i = sp.length - 1; i >= 0; i--) {
                    if (j !== 0 && j % 3 === 0) price_format = ',' + price_format;
                    price_format = sp[i] + price_format;
                    j++;
                }
                price.innerHTML = `
                                <hr>
                                <div>
                                    <div class="row g-3 align-items-cneter">
                                        <div class="col-auto mt-3">
                                            <p id="price" class="mb-0">Price: <span id="num_price">${price_format}</span><span id='num_error'>&plusmn${json.error}</span> Toman</p>
                                        </div>
                                    </div>
                                </div>
                                <hr>
            `;
            })
            .catch(console.log);

        event.preventDefault()
    } catch (e) {
        print(e)
    }
});

for (input of form.querySelectorAll('input')) {
    input.addEventListener('change', e => {
        price.innerHTML = '';
    })
}

for (select of form.querySelectorAll('select')) {
    select.addEventListener('change', e => {
        price.innerHTML = '';
    })
}