create table urls(
	id serial primary key,
	original_url TEXT not null,
	short_alias VARCHAR(7) UNIQUE NOT NULL,
	click_count INTEGER DEFAULT 0,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table click(
id serial primary key,
short_alias varchar(20),
clicked_at timestamp default NOW(),
foreign key (short_alias) references urls(short_alias)
);
