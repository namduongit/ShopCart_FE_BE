package com.ShopCart_FE_BE.config;

import java.math.BigDecimal;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HexFormat;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.ShopCart_FE_BE.exception.PaymentException;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Component
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MomoConfig {
    @Value("${env.momo.endpoint}")
    private String endpoint;

    @Value("${env.momo.partner_code}")
    private String partnerCode;

    @Value("${env.momo.access_key}")
    private String accessKey;

    @Value("${env.momo.secret_key}")
    private String secretKey;

    @Value("${env.momo.ipn}")
    private String ipn;

    @Value("${env.momo.return}")
    private String returnUrl;

    @Data
    @AllArgsConstructor
    public static class MetaEncryptSignMomo {
        private String accessKey;
        private BigDecimal amount;
        private String extraData;
        private String ipnUrl;
        private Long orderId;
        private String orderInfo;
        private String partnerCode;
        private String redirectUrl;
        private Long requestId;
        private RequestTypeMomo requestType;

        public String getSignature(String secretKey) throws Exception {
            String rawSignature = "accessKey=" + this.accessKey +
                    "&amount=" + this.amount +
                    "&extraData=" + this.extraData +
                    "&ipnUrl=" + this.ipnUrl +
                    "&orderId=" + this.orderId +
                    "&orderInfo=" + this.orderInfo +
                    "&partnerCode=" + this.partnerCode +
                    "&redirectUrl=" + this.redirectUrl +
                    "&requestId=" + this.requestId +
                    "&requestType=" + this.requestType;

            Mac hmac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secretKey.getBytes("UTF-8"), "HmacSHA256");
            hmac.init(secretKeySpec);

            return HexFormat.of().formatHex(hmac.doFinal(rawSignature.getBytes("UTF-8")));
        }
    }

    // In development, requestType is captureWallet
    public static enum RequestTypeMomo {
        captureWallet,
        refundWallet,
    }

    public String getPayUrl(MetaEncryptSignMomo metadata) throws Exception {
        JSONObject json = new JSONObject();

        json.put("partnerCode", metadata.getPartnerCode());
        json.put("orderId", metadata.getOrderId());
        json.put("requestId", metadata.getRequestId());
        json.put("amount", metadata.getAmount());
        json.put("orderInfo", metadata.getOrderInfo());
        json.put("redirectUrl", metadata.getRedirectUrl());
        json.put("ipnUrl", metadata.getIpnUrl());
        json.put("requestType", metadata.getRequestType().toString());
        json.put("extraData", metadata.getExtraData());

        String signature = metadata.getSignature(this.secretKey);
        json.put("signature", signature);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(this.getEndpoint() + "/create"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        JSONObject result = new JSONObject(response.body());

        if (result.has("payUrl")) {
            return result.getString("payUrl");
        }

        throw new PaymentException("Không thể tạo link thanh toán, vui lòng thử lại!");
    }
}
