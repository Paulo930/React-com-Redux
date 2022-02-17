import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeFilters, selectUniqueColors } from './store/products';

const Filter = () => {
  const colors = useSelector(selectUniqueColors);
  const dispatch = useDispatch();
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [selectedColors, setSelectedColors] = React.useState([]);

  React.useEffect(() => {
    dispatch(changeFilters({ name: 'colors', value: selectedColors }));
  }, [selectedColors, dispatch]);

  React.useEffect(() => {
    dispatch(
      changeFilters({
        name: 'prices',
        value: { min: +minPrice, max: +maxPrice },
      }),
    );
  }, [minPrice, maxPrice, dispatch]);

  function handleChange({ target: { value, checked } }) {
    if (checked) setSelectedColors([...selectedColors, value]);
    else setSelectedColors(selectedColors.filter((color) => color !== value));
  }

  function handleChecked(color) {
    return selectedColors.includes(color);
  }

  return (
    <div>
      <input
        type="number"
        value={minPrice}
        onChange={({ target: { value } }) => setMinPrice(value)}
        placeholder="min"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={({ target: { value } }) => setMaxPrice(value)}
        placeholder="max"
      />
      {colors.map((color) => (
        <label key={color}>
          <input
            type="checkbox"
            value={color}
            checked={handleChecked(color)}
            onChange={handleChange}
          />
          {color}
        </label>
      ))}
    </div>
  );
};

export default Filter;
