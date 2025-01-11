import React from 'react';
import Dropdown from "../../components/Dropdown";

const App: React.FC = () => {
    return (
        <div>
            {/* Example 1: Trigger là một đoạn văn bản */}
            <Dropdown trigger={<div>Hover me</div>}>
                <div>Option 1</div>
                <div>Option 2</div>
                <div>Option 3</div>
            </Dropdown>

            {/* Example 2: Trigger là một button */}
            <Dropdown trigger={<button>Click me</button>}>
                <div>Option A</div>
                <div>Option B</div>
                <div>Option C</div>
            </Dropdown>
        </div>
    );
};

export default App;
