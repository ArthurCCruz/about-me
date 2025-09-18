import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { AskQuestionDto } from "../dto/message.dto";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const validateQuestionDto = async (data: Record<string, unknown>)
: Promise<AskQuestionDto> => {
  // Check for extra fields
  const allowedFields = ["question"];
  const extraFields = Object.keys(data).filter((key) => !allowedFields.includes(key));

  if (extraFields.length > 0) {
    throw new ValidationError(`Extra fields not allowed: ${extraFields.join(", ")}`);
  }

  const dto = plainToInstance(AskQuestionDto, data);
  const errors = await validate(dto);

  if (errors.length > 0) {
    const errorMessages = errors.map((error) =>
      Object.values(error.constraints || {}).join(", ")
    ).join("; ");
    throw new ValidationError(errorMessages);
  }

  return dto;
};
