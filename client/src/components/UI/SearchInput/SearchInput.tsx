import { useState } from "react";
import type { FC } from "react";
import Input from "../Input/Input";
import styles from "./SearchInput.module.scss";
import classNames from "classnames";
import searchIconLight from "../../../assets/searchIconLight.svg"
import searchIconDark from "../../../assets/searchIconDark.svg"

export interface SearchInputProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    className?: string;
    variant?: "head" | "secondary";
    size?: "small" | "medium" | "large";
    withIcon?: boolean;
    theme?: "light" | "dark";
}
export const SearchInput: FC<SearchInputProps> = ({
    placeholder = "Search",
    onSearch,
    className,
    variant = "head",
    size = "medium",
    withIcon = false,
    theme = "light",
}) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query);
    };

    const finalFormClassName = classNames(
        styles.searchForm,
        styles[`searchForm--${variant}`],
        styles[`searchForm--${size}`],
        {
            [styles.searchFormWithIcon]: withIcon,
            [styles.searchFormDark]: theme === "dark", 
            [styles.searchFormLight]: theme === "light",
        },
        className
    );

    const finalInputClassName = classNames(
        styles.searchInput,
        styles[`searchInput--${variant}`]
    );

    const iconSrc = theme === "dark" ? searchIconLight : searchIconDark;

    return (
        <form onSubmit={handleSubmit} className={finalFormClassName}>
            <Input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={finalInputClassName}
            />
            {withIcon && (
                <img
                    src={iconSrc}
                    className={styles.searchIcon}
                />
            )}
        </form>
    );
};

export default SearchInput;