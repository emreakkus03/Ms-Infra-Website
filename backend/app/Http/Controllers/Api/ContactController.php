<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function __invoke(ContactRequest $request): JsonResponse
    {
        $data = $request->validated();

        $apiKey = config('services.brevo.api_key');
        $senderEmail = config('services.brevo.sender_email');
        $senderName = config('services.brevo.sender_name');

        $recipientEmail = config('services.contact.recipient_email');
        $recipientName = config('services.contact.recipient_name');

        if (
            blank($apiKey) ||
            blank($senderEmail) ||
            blank($recipientEmail)
        ) {
            Log::error('Contact form email configuration is incomplete.');

            return response()->json([
                'message' => 'Email configuration is incomplete.',
            ], 500);
        }

        $phone = $data['phone'] ?: 'Niet opgegeven';

        $html = view('emails.contact', [
            'name' => $data['name'],
            'email' => $data['email'],
            'phone' => $phone,
            'subject' => $data['subject'],
            'contactMessage' => $data['message'],
        ])->render();

        $response = Http::acceptJson()
            ->withHeaders([
                'api-key' => $apiKey,
            ])
            ->post('https://api.brevo.com/v3/smtp/email', [
                'sender' => [
                    'name' => $senderName,
                    'email' => $senderEmail,
                ],
                'to' => [
                    [
                        'name' => $recipientName,
                        'email' => $recipientEmail,
                    ],
                ],
                'replyTo' => [
                    'name' => $data['name'],
                    'email' => $data['email'],
                ],
                'subject' => 'Website contact: '.$data['subject'],
                'htmlContent' => $html,
                'tags' => [
                    'contact-form',
                ],
            ]);

        if ($response->failed()) {
            Log::error('Brevo contact email failed.', [
                'status' => $response->status(),
                'response' => $response->body(),
            ]);

            return response()->json([
                'message' => 'Unable to send message.',
            ], 502);
        }

        return response()->json([
            'message' => 'Message sent successfully.',
        ]);
    }
}