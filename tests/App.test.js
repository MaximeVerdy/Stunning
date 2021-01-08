import { render, screen } from '@testing-library/react';
import { shallow } from 'enzyme';
import App from '../reactapp/App';
import '../reactapp/css/mainwrapper.css'

test('renders learn react link', () => { // test 13
render(<App />);
const linkElement = screen.getByText(/learn react/i);
expect(linkElement).toBeInTheDocument();
});

test('render d`une <div />', () => {  // test 14
    const container = shallow(<Provider />);
    expect(container.find('div').length).toEqual(1);
});

