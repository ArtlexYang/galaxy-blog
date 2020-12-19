package pers.artlex.common.lang;

import lombok.Data;

/**
 * @author: ArtlexKylin
 * @date: 2020/11/28 22:09
 */
@Data
public class ResponseResult {
    private int statusCode;
    private String massage;
    private Object data;

    /**
     * 构造方法不允许外部调用
     */
    private ResponseResult(){}
    private ResponseResult(int statusCode, String massage, Object data) {
        this.statusCode = statusCode;
        this.massage = massage;
        this.data = data;
    }

    /**
     * 响应客户端消息成功
     * @param data
     * @return
     */
    public static ResponseResult success(Object data) {
        return new ResponseResult(200, "操作成功", data);
    }

    /**
     * 响应客户端消息成功
     * @param massage
     * @param data
     * @return
     */
    public static ResponseResult success(String massage, Object data) {
        return new ResponseResult(200, massage, data);
    }

    /**
     * 响应客户端消息成功
     * @param statusCode
     * @param massage
     * @param data
     * @return
     */
    public static ResponseResult success(int statusCode, String massage, Object data) {
        return new ResponseResult(statusCode, massage, data);
    }

    /**
     * 响应客户端消息失败
     * @param massage
     * @return
     */
    public static ResponseResult failure(String massage) {
        ResponseResult rr = new ResponseResult();
        rr.setStatusCode(500);
        rr.setMassage(massage);
        rr.setData(null);
        return new ResponseResult(500, massage, null);
    }

    /**
     * 响应客户端消息失败
     * @param massage
     * @param data
     * @return
     */
    public static ResponseResult failure(String massage, Object data) {
        return new ResponseResult(500, massage, data);
    }

    /**
     * 响应客户端消息失败
     * @param statusCode
     * @param massage
     * @param data
     * @return
     */
    public static ResponseResult failure(int statusCode, String massage, Object data) {
        return new ResponseResult(statusCode, massage, data);
    }
}
