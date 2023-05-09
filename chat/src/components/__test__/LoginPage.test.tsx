import userEvent from "@testing-library/user-event";
import LoginPage from "../LoginPage";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";

describe("LoginPage", () => {
    it("should render LoginPage", () => {
        render(<LoginPage />);
        const formElement = screen.getByTestId("loginForm");
        expect(formElement).toBeInTheDocument();
    });

    it("should render login form with email and password inputs and button", () => {
        render(<LoginPage />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const buttonElement = screen.getByRole("button", { name: /login/i });
        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(buttonElement).toBeInTheDocument();
    });

    it('updates form state when email and password inputs changes', () => {
        render(<LoginPage />);

        const emailInput = screen.getByLabelText('Email');
        const passwordInput = screen.getByTestId('password');
        console.log(passwordInput.querySelector('input'));
        //console.log(emailInput);
        //console.log(passwordInput);
        act(() => {
            userEvent.type(emailInput, 'asd@asd.asd');
            void userEvent.type(passwordInput.querySelector('input'), 'asd');
        });

        expect(emailInput).toHaveValue('asd@asd.asd');
        expect(passwordInput).toHaveValue('asd');
    });
});