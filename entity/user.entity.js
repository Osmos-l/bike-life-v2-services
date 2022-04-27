const bcrypt = require("bcrypt");
const Token = require("../token");
const TokenExpiredError = require("jsonwebtoken/lib/TokenExpiredError");
const jwt = require("jsonwebtoken");
const refreshTokenRepository = require("../repository/refresh_token.repository");

class User {
    #_id;

    #_email;

    #_password;

    #_username;

    #_created_at;

    #_updated_at;

    constructor() {
    }

    get id() {
        return this.#_id;
    }

    set id(value) {
        this.#_id = value;
    }

    get email() {
        return this.#_email;
    }

    set email(value) {
        this.#_email = value;
    }

    get password() {
        return this.#_password;
    }

    set password(value) {
        this.#_password = value;
    }

    get username() {
        return this.#_username;
    }

    set username(value) {
        this.#_username = value;
    }

    get created_at() {
        return this.#_created_at;
    }

    set created_at(value) {
        this.#_created_at = value;
    }

    get updated_at() {
        return this.#_updated_at;
    }

    set updated_at(value) {
        this.#_updated_at = value;
    }

    toJSON() {
        return {
            id: this.#_id,
            username: this.#_username,
            email: this.#_email,
            created_at: this.#_created_at,
            updated_at: this.#_updated_at
        };
    }

    async comparePassword(toCompare) {
        return await bcrypt.compare(toCompare, this.password);
    }

    async getAccessToken() {
        return await Token.generate({ ID: this.#_id },
            process.env.PAYLOAD_TOKENS, process.env.ACCESS_TOKEN_DURATION);
    }

    async getRefreshToken() {
        const refreshToken = await refreshTokenRepository.getUserToken(this);

        if (refreshToken) {
            try {
                await jwt.verify(refreshToken.token, process.env.PAYLOAD_TOKENS);
            } catch (e) {
                if (e instanceof TokenExpiredError) {
                    await refreshTokenRepository.deleteUserToken(this);
                    return await this.getRefreshToken();
                }

                console.error(e);
                throw e;
            }

            return refreshToken.token;
        }

        const token = await Token.generate({ ID: this.#_id },
            process.env.PAYLOAD_TOKENS, process.env.REFRESH_TOKEN_DURATION);
        await refreshTokenRepository.insert(this, token);

        return token;
    }
}

module.exports = { User }
