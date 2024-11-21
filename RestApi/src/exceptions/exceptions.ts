import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationErrorException extends HttpException {
    constructor(message: string) {
        super({ message }, HttpStatus.BAD_REQUEST);
    }
}

export class NotFoundException extends HttpException {
    constructor(message: string) {
        super({ message }, HttpStatus.NOT_FOUND);
    }
}

export class ConflictException extends HttpException {
    constructor(message: string) {
        super({ message }, HttpStatus.CONFLICT);
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(message: string) {
        super({ message }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export class EmptyFieldException extends HttpException {
    constructor(message: string) {
        super({ message }, HttpStatus.BAD_REQUEST);
    }
}

export class InvalidFieldException extends HttpException {
    constructor(message: string) {
        super({ message }, HttpStatus.BAD_REQUEST);
    }
}
