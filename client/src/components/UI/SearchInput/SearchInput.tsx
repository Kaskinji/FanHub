import { useState } from "react";
import type { FC } from "react";
import Input from "../Input/Input";
import styles from "./SearchInput.module.scss";
import classNames from "classnames";

interface SearchInputProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    className?: string;
    variant?: "head" | "secondary";
    size?: "small" | "medium" | "large";
    withIcon?: boolean;
}

const SearchInput: FC<SearchInputProps> = ({
    placeholder = "Search",
    onSearch,
    className,
    variant = "primary",
    size = "medium",
    withIcon = false
}) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const finalClassName = classNames(
        styles.searchInput,
        {
            [styles[`searchInput--${variant}`]]: variant,
            [styles[`searchInput--${size}`]]: size,
            [styles.searchInputWithIcon]: withIcon,
        },
        className
    );

    return (
        <form onSubmit={handleSubmit} className={styles.searchForm}>
            {withIcon && <div className={styles.searchIcon}> lupa </div>}
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={finalClassName}
            />
        </form>
    );
};

export default SearchInput;