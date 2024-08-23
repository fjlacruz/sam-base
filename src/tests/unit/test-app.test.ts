import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../lambdas/app';
import { expect, describe, it , jest} from '@jest/globals';



describe('Unit test for app handler', function () {
    const createEvent = (overrides: Partial<APIGatewayProxyEvent> = {}): APIGatewayProxyEvent => ({
        httpMethod: 'GET',
        body: '',
        headers: {},
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path: '/',
        pathParameters: {},
        queryStringParameters: {},
        requestContext: {
            accountId: '123456789012',
            apiId: '1234',
            authorizer: {},
            httpMethod: 'GET',
            identity: {
                accessKey: '',
                accountId: '',
                apiKey: '',
                apiKeyId: '',
                caller: '',
                clientCert: {
                    clientCertPem: '',
                    issuerDN: '',
                    serialNumber: '',
                    subjectDN: '',
                    validity: { notAfter: '', notBefore: '' },
                },
                cognitoAuthenticationProvider: '',
                cognitoAuthenticationType: '',
                cognitoIdentityId: '',
                cognitoIdentityPoolId: '',
                principalOrgId: '',
                sourceIp: '',
                user: '',
                userAgent: '',
                userArn: '',
            },
            path: '/',
            protocol: 'HTTP/1.1',
            requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
            requestTimeEpoch: 1428582896000,
            resourceId: '123456',
            resourcePath: '/',
            stage: 'dev',
        },
        resource: '',
        stageVariables: {},
        ...overrides,
    });
    it('verifies successful response', async () => {
        const event = createEvent();
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'sam base',
                stage: undefined,
            }),
        );
    });
    it('verifies response with stage variable', async () => {
        process.env.stage = 'test';
        const event = createEvent();
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'sam base',
                stage: 'test',
            }),
        );
    });

    it('verifies error response', async () => {
        const event = createEvent();
        jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock console.log to avoid cluttering the test output
        jest.spyOn(JSON, 'stringify').mockImplementationOnce(() => { throw new Error('Forced error'); }); // Simulate an error
    
        const result: APIGatewayProxyResult = await lambdaHandler(event);
    
        expect(result.statusCode).toEqual(500);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'some error happened',
            }),
        );
    });
    
});
