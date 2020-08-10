import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email,
            password,
        },
        onSuccess: () => Router.push('/'),
    });

    const onSubmit = async (e) => {
        e.preventDefault();

        await doRequest();
    };

    return (
        <div className="container">
            <div className="row my-3 mx-auto justify-content-center">
                <h1>Sign Up</h1>
            </div>
            <div className="row">
                <div className="col-6 m-auto">
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="form-control"
                            ></input>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className="form-control"
                            ></input>
                        </div>
                        {errors}
                        <button className="btn btn-primary">Sign Up</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default signup;
