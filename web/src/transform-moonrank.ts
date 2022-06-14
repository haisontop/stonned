import moonRankImport from '../public/moonRankData.json'
import fs from 'fs';

const importFull = moonRankImport as any

const transform = () => {
  const output = []
  for (const imp of importFull.mints) {
    output.push({
      name: imp.name,
      address: imp.mint,
      role: imp.rank_explain.find((obj: any) => obj.attribute === 'Role').value,
      image: imp.image

    })
    output.sort((a,b) => {
      if (a.name.includes('420 Seal') && !b.name.includes('420 Seal')) {
        return 1;
      }
      const arrA = a.name.split('#')
      const arrB = b.name.split('#')
      if (arrA.length > 1 && arrB.length > 1) {
        return Number(arrA[1]) - Number(arrB[1])
      } else {
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
      }
    })
  }
  fs.writeFileSync('./public/output.json', JSON.stringify(output))
}

transform();