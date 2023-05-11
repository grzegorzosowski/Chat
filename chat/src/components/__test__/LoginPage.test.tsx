import userEvent from "@testing-library/user-event";
import LoginPage, { LoginForm } from "../LoginPage";
import { render, screen, act } from "@testing-library/react";
import fetchMock, { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()

describe("LoginPage", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    })
    it("should render LoginPage", () => {
        render(<LoginPage />);
        const formElement = screen.getByTestId("loginForm");
        expect(formElement).toBeInTheDocument();
    });

    it("should render login form with email and password inputs and button", () => {
        render(<LoginPage />);

        const emailInput = screen.getByLabelText(/email/i);
        //const passwordInput = screen.getByLabelText(/password/i);
        const buttonElement = screen.getByRole("button", { name: /login/i });
        expect(emailInput).toBeInTheDocument();
        //expect(passwordInput).toBeInTheDocument();
        expect(buttonElement).toBeInTheDocument();
    });

    it('updates form state when email and password inputs changes', () => {
        render(<LoginPage />);
        screen.debug();
        const emailInput = screen.getByLabelText('Email');
        act(() => {
            userEvent.type(emailInput, 'asd@asd.asd');
        })

        expect(emailInput).toHaveValue('asd@asd.asd');

        const passwordContainer = screen.getByTestId('password')
        const passwordInput = passwordContainer.querySelector('input')
        if (passwordInput) {
            act(() => {
                userEvent.type(passwordInput, '123456')
            })
        }
        expect(passwordInput).toHaveValue("123456");
    });

    it('calls logUser function when login button is clicked, fetching data', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }), { status: 200 })
        const mockHandleForm = jest.fn();

        render(<LoginForm handleSubmit={mockHandleForm} />);

        const emailInput = screen.getByLabelText('Email');
        const passwordContainer = screen.getByTestId('password')
        const passwordInput = passwordContainer.querySelector('input')
        if (passwordInput) {
            act(() => {
                userEvent.type(passwordInput, '123456')
            })
        }
        act(() => {
            userEvent.type(emailInput, 'asd@asd.asd');
        })
        const loginButton = screen.getByRole('button', { name: 'Login' });
        act(() => {
            userEvent.click(loginButton);
        })
        const res = await fetch('api/login/password')
        expect(res.status).toEqual(200);
        expect(await res.json()).toEqual({ data: '12345' });
        expect(mockHandleForm.mock.calls.length).toBe(1)
    });
});


