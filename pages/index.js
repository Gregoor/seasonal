import colors from 'material-colors';
import { Component } from 'react';
import styled, { injectGlobal } from 'styled-components';
import data from '../data/data';

injectGlobal`
  body {
    margin: 0;
  }
`;

const Spacer = styled.div`
  margin: 30px;
`;

const Wrapper = styled.div`
  overflow: auto;
  min-height: 100vh;
  background: ${({ month }) =>
    colors[
      {
        1: 'lightBlue',
        2: 'blue',
        3: 'green',
        4: 'lightGreen',
        5: 'lime',
        6: 'yellow',
        7: 'amber',
        8: 'red',
        9: 'deepOrange',
        10: 'brown',
        11: 'teal',
        12: 'cyan'
      }[month]
    ][200]};
  transition: background 1000ms linear;
`;

const Container = styled.main`
  margin: 0 auto;
  max-width: 500px;

  @media (max-width: 520px) {
    padding: 0 10px;
  }
`;

const MonthSelect = styled.select`
  margin: 0 auto;
  display: flex;
  font-size: 20px;
`;

const FieldsetInner = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Fieldset = styled(({ children, ...props }) => (
  <fieldset {...props}>
    <FieldsetInner>{children}</FieldsetInner>
  </fieldset>
))`
  border: 0;
  margin-left: 0;
  padding: 0;
`;

const H3 = styled.h3`
  margin: 0;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;

  display: flex;
  flex-wrap: wrap;

  list-style: none;
`;

const ListItem = styled.li`
  width: 33%;
  padding: 10px;
  box-sizing: border-box;
  text-align: center;
`;

const allCategories = Object.keys(data);
const items = Object.entries(data).reduce(
  (allItems, [category, subItems]) =>
    allItems.concat(subItems.map(item => ({ ...item, category }))),
  []
);

const ItemList = ({ title, items }) =>
  items.length === 0 ? null : (
    <>
      <H3>{title}</H3>
      <List>
        {items.map(({ imageURL, name }) => (
          <ListItem key={name}>
            {imageURL && <img src={imageURL} alt={name} />}
            {name}
          </ListItem>
        ))}
      </List>
      <Spacer />
    </>
  );

export default class extends Component {
  state = {
    categories: allCategories,
    currentMonth: new Date().getMonth() + 1
  };

  setCategory = category => {
    this.setState(({ categories }) => ({
      categories: categories.includes(category)
        ? categories.filter(c => c !== category)
        : categories.concat(category)
    }));
  };

  setMonth = event => {
    this.setState({ currentMonth: Number(event.target.value) });
  };

  render() {
    const { categories, currentMonth } = this.state;

    const filteredItems = items
      .filter(item => categories.includes(item.category))
      .sort((i1, i2) => (i1.name > i2.name ? 1 : -1));

    const [freshItems, storedItems, restItems] = filteredItems.reduce(
      ([freshItems, storedItems, restItems], item) => {
        if ((item.fresh || []).includes(currentMonth)) {
          freshItems = freshItems.concat(item);
        } else if ((item.store || []).includes(currentMonth)) {
          storedItems = storedItems.concat(item);
        } else {
          restItems = restItems.concat(item);
        }

        return [freshItems, storedItems, restItems];
      },
      [[], [], []]
    );

    return (
      <Wrapper month={currentMonth}>
        <Spacer />
        <Container>
          <h1>Saisonal</h1>
          <MonthSelect value={currentMonth} onChange={this.setMonth}>
            {Array.from({ length: 12 }).map((_, i) => {
              const date = new Date();
              date.setMonth(i);
              return (
                <option key={i} value={i + 1}>
                  {date.toLocaleString([], { month: 'long' })}
                </option>
              );
            })}
          </MonthSelect>
          <Spacer />
          <Fieldset>
            {allCategories.map(category => (
              <label key={category}>
                <input
                  type="checkbox"
                  onChange={() => this.setCategory(category)}
                  checked={categories.includes(category)}
                />
                {category}
              </label>
            ))}
          </Fieldset>
          <Spacer />
          <ItemList title="Frisch" items={freshItems} />
          <ItemList title="Aus dem Lager" items={storedItems} />
          <ItemList title="Importiert" items={restItems} />
        </Container>
      </Wrapper>
    );
  }
}
