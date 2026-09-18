import { BrowserRouter, Route, Routes } from 'react-router';
import { MotionConfig } from 'motion/react';

import { HomePage } from '$/pages/HomePage';

function App() {
    return (
        // `reducedMotion="user"` disables transform/layout animations for
        // users with prefers-reduced-motion enabled; opacity fades still run.
        <MotionConfig reducedMotion="user">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </BrowserRouter>
        </MotionConfig>
    );
}

export default App;
