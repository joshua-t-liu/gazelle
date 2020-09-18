import React, { useState } from 'react';

const Filter = ({ group, categories, updateCategories }) => {
  const [allSelected, setAllSelected] = useState(true);

  const values = Array.from(categories.keys());

  const toggle = (event) => {
    const { value, name, checked } = event.target;
    updateCategories((categories) => {
      const updatedCategories = new Map(categories);
      if (checked) {
        updatedCategories.set(name, true);
      } else {
        updatedCategories.set(name, false);
      }
      return updatedCategories;
    })
  }

  const selectAll = (event) => {
    const { value, name, checked } = event.target;

    updateCategories((categories) => {
      const updatedCategories = new Map(categories);
      values.forEach((key) => updatedCategories.set(key, checked));
      return updatedCategories;
    });

    setAllSelected(checked);
  }

  return (
    <fieldset>
      <label>{group}</label>
      <div>
        <input type='checkbox' name='all' checked={allSelected} onChange={selectAll} />
        <label>Select All</label>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {values.map((val) => (
          <div style={{ width: '25%' }} >
            <input type='checkbox' name={val} checked={categories.get(val)} onChange={toggle} />
            <label>{val}</label>
          </div>
        ))}
      </div>
    </fieldset>
  )
}



export default ({ phones, setPhones, carriers, setCarriers, models, setModels }) => {
  return (
    <form>
      <Filter group='Phones' categories={phones} updateCategories={setPhones} />
      <Filter group='Carriers' categories={carriers} updateCategories={setCarriers} />
      <Filter group='Models' categories={models} updateCategories={setModels} />
    </form>
  );
}