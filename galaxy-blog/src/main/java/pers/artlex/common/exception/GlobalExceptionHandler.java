package pers.artlex.common.exception;

import pers.artlex.common.lang.ResponseResult;
import lombok.extern.slf4j.Slf4j;
import org.apache.shiro.ShiroException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * RestControllerAdvice：Restful格式下的控制器增强器，捕获全局的控制器异常并返回json格式
 *
 * @author: ArtlexKylin
 * @date: 2020/12/1 21:47
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {
    /**
     * ResponseStatus：返回的状态码401（未经许可的）
     * ExceptionHandler：拦截的异常是Shiro异常
     *
     * @param e
     * @return
     */
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(value = ShiroException.class)
    public ResponseResult handler(ShiroException e) {
        log.error("权限异常：----------------{}", e);
        return ResponseResult.failure(401, e.getMessage(), null);
    }

    /**
     * ResponseStatus：返回的状态码400
     * ExceptionHandler：拦截的异常是方法参数异常
     *
     * @param e
     * @return
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public ResponseResult handler(MethodArgumentNotValidException e) {
        log.error("实体校验异常：----------------{}", e);
        BindingResult bindingResult = e.getBindingResult();
        ObjectError objectError = bindingResult.getAllErrors().stream().findFirst().get();

        return ResponseResult.failure(objectError.getDefaultMessage());
    }

    /**
     * ResponseStatus：返回的状态码400
     * ExceptionHandler：拦截的异常是非法参数异常
     *
     * @param e
     * @return
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = IllegalArgumentException.class)
    public ResponseResult handler(IllegalArgumentException e) {
        log.error("Assert异常：----------------{}", e);
        return ResponseResult.failure(e.getMessage());
    }

    /**
     * ResponseStatus：返回的状态码400
     * ExceptionHandler：拦截的异常是运行时异常
     *
     * @param e
     * @return
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(value = RuntimeException.class)
    public ResponseResult handler(RuntimeException e) {
        log.error("运行时异常：----------------{}", e);
        return ResponseResult.failure(e.getMessage());
    }

}
