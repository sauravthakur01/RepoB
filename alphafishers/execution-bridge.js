const fs = require('fs').promises;
const fetch = require('node-fetch');

let config = require('/root/alphafishers/configurations/server-config.js');

let os = require('os');
let cpus =  os.cpus().length;

console.log(cpus);

(async function (){

    let execution_bridge_template =  await fs.readFile('/root/alphafishers/automated-strategies/execution-bridges/execution-bridge-template-v2.js','utf8');

    let strategies = await fetch(`${config.ca_mapped}/central-server/api/strategy`, {
        headers : config.ca_headers
        });
        
        // strategies['data] is array of object and object has field name

        strategies['data'] = await strategies.json();
        let strategies_name =  strategies['data'].map(arr => arr.name )

        // console.log(strategies['data'])

        let strategies_len = strategies_name.length ;

        let strategiesPerCpu = Math.ceil( strategies_len/cpus );
        
        for(let i = 0 ; i<cpus ; i++){
            
            let strategies_arr = [] ;
            
            // stra = 10 , cpu= 4
            // 10/4 = 2.5 => 3
            // 3,3,3,1
            // divide strategy names across each cpus
            
            let start = i * strategiesPerCpu;
            let end = start + strategiesPerCpu

            strategies_arr.push(strategies_name.slice(start , end))
                       
            await fs.writeFile(`/root/alphafishers/automated-strategies/execution-bridges/execution-bridge-${i}.js` , `let strategies = ${JSON.stringify(strategies_arr)};\n`+execution_bridge_template);
        
        }
    

        

})()                        


