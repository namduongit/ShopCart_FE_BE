package com.ShopCart_FE_BE.utils;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.ShopCart_FE_BE.config.UserDetailsImp;
import com.ShopCart_FE_BE.dto.JwtDto;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtUtils {
    @Value("${env.jwt_secret}")
    private String JWT_SECRET;

    private Key getSigningKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(this.JWT_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public JwtDto generateJwtToken(Authentication authentication) {
        UserDetailsImp userPrincipal = (UserDetailsImp) authentication.getPrincipal();

        String token = Jwts.builder()
                .setSubject(
                        userPrincipal.getUsername())
                .claim("id", userPrincipal.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 86400000))
                .signWith(this.getSigningKey())
                .compact();

        return new JwtDto(userPrincipal.getId(), userPrincipal.getUsername(), token);
    }

    public ResponseCookie setStateCookie(String token) {
        return ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(86400)
                .sameSite("Strict")
                .build();
    }

    public void clearStateCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    public Claims extractClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(this.getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("Error parsing token: " + e.getMessage());
            return null;
        }
    }
}
