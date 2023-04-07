import { FastifyReply, FastifyRequest } from 'fastify';

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true });

    const { sub, role } = request.user;

    const token = await reply.jwtSign(
      {
        role,
      },
      {
        sub,
      }
    );

    const refreshToken = await reply.jwtSign(
      {
        role,
      },
      {
        sub,
        expiresIn: '7d',
      }
    );

    return reply
      .status(200)
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .send({ token });
  } catch (error) {
    if (error instanceof Error) {
      return reply.status(401).send({ message: error.message });
    }

    throw error;
  }
}
