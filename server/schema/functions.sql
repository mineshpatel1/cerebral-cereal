-- Returns the current time as a UTC BIGINT
CREATE OR REPLACE FUNCTION now_utc(OUT _now_utc BIGINT) AS
$$
BEGIN
    SELECT extract(epoch FROM now()) INTO _now_utc;
END;
$$ LANGUAGE plpgsql;

-- Converts a UnixTime into a TIMESTAMPTZ
CREATE OR REPLACE FUNCTION from_unixtime(unix_time BIGINT, OUT ts TIMESTAMPTZ) AS
$$
BEGIN
	SELECT TIMESTAMPTZ 'epoch' + unix_time * INTERVAL '1 second' INTO ts;
END;
$$ LANGUAGE plpgsql;